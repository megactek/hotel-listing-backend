const path = require("path");
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const PROTO_FILE = "./proto/hotel.proto";
const { readFileSync } = require("fs");
const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_FILE));

const grpcObject = grpc.loadPackageDefinition(packageDef);

const hotelPackage = grpcObject.hotelPackage;
const hotels = JSON.parse(readFileSync(path.resolve(__dirname, "./data.json")));

const PORT = 9040;
function main() {
  const server = getServer();
  server.bindAsync(
    "0.0.0.0:" + PORT,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.log(err);
      }
      console.log("server running on port: " + PORT);
      server.start();
    }
  );
}
function getServer() {
  const server = new grpc.Server();
  server.addService(hotelPackage.Hotels.service, {
    getHotels: getHotels,
    filterHotels: filterHotels,
    getHotelDetails: getHotelDetails,
    saveFavorite: saveFavorite,
    getFavorite: getFavorite,
  });
  return server;
}

function getHotels(call, callback) {
  const query = call.request.location ? call.request.location : " ";
  const filteredHotels = hotels.filter((hotel) =>
    hotel.location.toLowerCase().includes(query.toLowerCase())
  );
  if (filteredHotels.length) {
    callback(null, { hotels: filteredHotels.slice(0, 50) });
    return;
  }
  callback(null, { hotels: [] });
}

function filterHotels(call, callback) {
  const { minPrice, maxPrice, amenities, location } = call.request;
  let locate = location.location ? location.location.toLowerCase() : " ";
  const filteredHotels = hotels.filter((hotel) => {
    let price = String(hotel.price).replace(/[^\d]/g, "");
    return (
      price != undefined &&
      price != null &&
      Number(price) >= minPrice &&
      Number(price) <= maxPrice &&
      (amenities == "" || amenities == undefined
        ? true
        : hotel.amenities.toLowerCase().includes(amenities.toLowerCase())) &&
      hotel.location.toLowerCase().includes(locate)
    );
  });
  if (filteredHotels.length) {
    callback(null, {
      hotels: filteredHotels.slice(0, 50),
    });
    return;
  }
  callback(null, { hotels: [] });
}
function getHotelDetails(call, callback) {
  const hotelId = call.request.id;
  const getHotelDetails = hotels.find((hotel) => hotel.id == hotelId);
  if (getHotelDetails) {
    callback(null, getHotelDetails);
    return;
  }
  callback(null, { err: "hotel with id: " + hotelId + " not found" });
}
const favoriteHotels = [];
function saveFavorite(call, callback) {
  const hotelId = call.request.id;
  const getHotelDetails = hotels.find((hotel) => hotel.id == hotelId);

  if (getHotelDetails) {
    const check = favoriteHotels.find(
      (hotel) => hotel.id == getHotelDetails.id
    );
    if (!check) favoriteHotels.push(getHotelDetails);
    callback(null, getHotelDetails);
    return;
  }
  callback(null, { err: "hotel with id: " + hotelId + " not found" });
}
function getFavorite(call, callback) {
  callback(null, { hotels: favoriteHotels });
}

main();
