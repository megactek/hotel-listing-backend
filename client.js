const path = require("path");
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const PROTO_FILE = "./proto/hotel.proto";

const packageDefinition = protoLoader.loadSync(
  path.resolve(__dirname, PROTO_FILE)
);

const grpcObject = grpc.loadPackageDefinition(packageDefinition);

const hotelPackage = grpcObject.hotelPackage;

const client = new hotelPackage.Hotels(
  "localhost:9040",
  grpc.credentials.createInsecure()
);

class Hotels {
  constructor() {
    this.client = client;
  }
  getHotels(data) {
    return new Promise((resolve, reject) => {
      this.client.getHotels(data, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }
  filterHotels(data) {
    return new Promise((resolve, reject) => {
      this.client.filterHotels(data, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }
  saveFavorite(data) {
    new Promise((resolve, reject) => {
      this.client.saveFavorite(data, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }
  getFavorite() {
    return new Promise((resolve, reject) => {
      this.client.getFavorite(null, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }
}

const hotel = new Hotels();

(async () => {
  const response = await hotel
    .getHotels({ location: "new" })
    .catch(console.error);
  console.log(response);
})();
