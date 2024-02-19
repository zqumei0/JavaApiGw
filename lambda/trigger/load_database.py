import boto3
from json import load
from os import environ
from typing import Dict

MOCK_DATA_FILE = environ["MOCK_DATA_FILE"]
ITEM_TABLE = environ["ITEM_TABLE"]
DYNAMODB_CLIENT = boto3.resource("dynamodb")


def parse_data_file() -> typing.Dict:
    with open(MOCK_DATA_FILE) as data_file:
        return load(data_file)


def insert_item(item: Dict[str, str], item_table) -> None:
    item_table.put_item(Item=item)


def handler(event, context):
    item_table = DYNAMODB_CLIENT.Table(ITEM_TABLE)
    mock_data = parse_data_file()

    for item in mock_data:
        insert_item(item, item_table)
