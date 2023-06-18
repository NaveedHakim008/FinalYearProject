
from pymongo import MongoClient
import os
from dotenv import load_dotenv
load_dotenv()
MongoDB_URL=os.getenv('MongoDB_URL')
conn=MongoClient(MongoDB_URL)