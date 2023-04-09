import csv
import random
import json

hotels_file = "hotels.csv"
hotels_features = "hotels_features.csv"
json_file_path = "data.json"

key_mapping = {
    "Hotel_Name": "name",
    "Address": "location",
    "Cost": "price",
    "Rating": "rating",
    "id": "id",
}

ignored_keys = {"Location", "Property_type", "Likes", "Review", "no_name"}

amenities = []


def return_amenities():
    num_items = random.randint(4, 10)
    indices = set()
    while len(indices) < num_items:
        index = random.randint(0, len(amenities) - 1)
        indices.add(index)
    final_list = [amenities[i] for i in indices]
    return ", ".join(final_list)


def write_to_json():
    with open(hotels_file, "r") as csvfile:
        csv_reader = csv.DictReader(csvfile)
        rows = list(csv_reader)

    json_list = []
    for row in rows:
        sanitized_row = {}
        for key, value in row.items():
            if key in ignored_keys:
                continue
            sanitized_key = key_mapping.get(key, "no_name")

            sanitized_value = value.strip()

            if sanitized_key == "id":
                sanitized_value = int(value)

            if sanitized_key == "rating":
                sanitized_value = round(random.uniform(1, 10), 1)

            sanitized_row[sanitized_key] = sanitized_value
        sanitized_row["image"] = "https://source.unsplash.com/random"
        sanitized_row["amenities"] = str(return_amenities())

        json_list.append(sanitized_row)

    with open(json_file_path, "w") as jsonfile:
        json.dump(json_list, jsonfile)


def get_not_in_amenities(amenities_list):
    list_obj = [feature for feature in amenities_list if feature not in amenities]
    return list_obj


def main():
    with open(hotels_features, "r") as csvfile:
        csv_reader = csv.DictReader(csvfile)
        rows = list(csv_reader)

    for row in rows:
        for key, value in row.items():
            if key != "amenities":
                continue
            h_list = get_not_in_amenities(str(value).split(","))

            amenities.extend(h_list)
    write_to_json()


main()
