const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = "../proto/hotel.proto";

const packageDefinition = protoLoader.loadSync(
  path.resolve(__dirname, PROTO_PATH)
);

const grpcObject = grpc.loadPackageDefinition(packageDefinition);

const hotelPackage = grpcObject.hotelPackage;
const client = new hotelPackage.Hotels(
  "localhost:9040",
  grpc.credentials.createInsecure()
);

describe("Hotels search", () => {
  test("should get hotels", (done) => {
    const location = { location: "gbagada" };
    client.getHotels(location, (err, response) => {
      expect(err).toBeNull();
      expect(response.hotels.length).toBeGreaterThan(0);
      done();
    });
  });
  test("should not get hotels", (done) => {
    const location = { location: "new york" };
    client.getHotels(location, (err, response) => {
      expect(err).toBeNull();
      expect(response).toEqual({});
      done();
    });
  });
});

describe("Hotels filter", () => {
  test("should get hotels", (done) => {
    const filters = {
      minPrice: 1000,
      maxPrice: 1000000,
      amenities: "kids",
      location: { location: "ikeja" },
    };
    client.filterHotels(filters, (err, response) => {
      expect(err).toBeNull();
      expect(response.hotels.length).toBeGreaterThan(0);
      done();
    });
  });
  test("should get hotels", (done) => {
    const filters = {
      minPrice: 1000,
      maxPrice: 10000,
      amenities: "kids",
      location: undefined,
    };
    client.getHotels(filters, (err, response) => {
      expect(err).toBeNull();
      expect(response.hotels.length).toBeGreaterThan(0);
      done();
    });
  });
  test("should not get hotels", (done) => {
    const filters = {
      minPrice: 1000,
      maxPrice: undefined,
      amenities: "kids",
      location: { location: "ikeja" },
    };
    client.getHotels(filters, (err, response) => {
      expect(err).toBeNull();
      expect(response).toEqual({});
      done();
    });
  });
});

describe("Get Hotel Details", () => {
  test("should get hotel", (done) => {
    const hotel = { id: 1 };
    client.getHotelDetails(hotel, (err, response) => {
      expect(err).toBeNull();
      expect(response.name).toContain("Kitex");
      done();
    });
  });
  test("should not get hotel", (done) => {
    const hotel = { id: 10000000 };
    client.getHotelDetails(hotel, (err, response) => {
      expect(err).toBeNull();
      expect(response).toEqual({});
      done();
    });
  });
});

describe("Save Favorite Hotel", () => {
  test("should save hotel", (done) => {
    const hotel = { id: 1 };
    client.saveFavorite(hotel, (err, response) => {
      expect(err).toBeNull();
      expect(response.name).toContain("Kitex");
      done();
    });
  });
  test("should not save hotel", (done) => {
    const hotel = { id: 10000000 };
    client.saveFavorite(hotel, (err, response) => {
      expect(err).toBeNull();
      expect(response).toEqual({});
      done();
    });
  });
  test("test saved hotels", (done) => {
    client.getFavorite({}, (err, response) => {
      expect(err).toBeNull();
      expect(response.hotels.length).toBeGreaterThan(0);
      expect(Number(response.hotels[0].id)).toEqual(1);
      expect(response.hotels[0].name).toContain("Kitex");
      done();
    });
  });
});
