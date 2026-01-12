from pymongo import MongoClient

class Database:
    _client = None

    @classmethod
    def get_collection(cls, collection_name):
        if cls._client is None:
            # Using your specific connection string
            uri = "mongodb+srv://juhuh3001_db_user:Espe123@cluster0.olchaay.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
            cls._client = MongoClient(uri)
        return cls._client["supply_chain_db"][collection_name]
    