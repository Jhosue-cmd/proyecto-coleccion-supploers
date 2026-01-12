from database import Database
from bson import ObjectId

class SupplierController:
    def __init__(self):
        self.collection = Database.get_collection("suppliers")

    
    # Rule: Hide the first digits of 'celular', show only the last 4.
    def get_all(self):
        suppliers = list(self.collection.find())
        results = []
        for s in suppliers:
            s["uid"] = str(s["_id"])
            
            # Logic: Masking
            raw_phone = s.get("celular", "")
            if len(raw_phone) > 4:
                s["celular"] = "****" + raw_phone[-4:]
            
            # Ensure status exists for frontend
            if "business_status" not in s: 
                s["business_status"] = "Standard"
            
            results.append(s)
        return results

   
    # Rule: If rating >= 4.5, status is 'Gold Partner'. Otherwise 'Standard'.
    def create(self, supplier_data):
        data = supplier_data.dict()
        
        # Logic
        if data["rating"] >= 4.5:
            data["business_status"] = "Gold Partner"
        elif data["pedidos"] > 50:
             data["business_status"] = "High Volume"
        else:
            data["business_status"] = "Standard"
            
        result = self.collection.insert_one(data)
        data["uid"] = str(result.inserted_id)
        return data

    
    # Rule: Rating cannot be updated to less than 1.0.
    def update_rating(self, uid, new_rating):
        if new_rating < 1.0:
            raise ValueError("Business Rule: Rating cannot be lower than 1.0")
        
        # Check if exists
        if not self.collection.find_one({"_id": ObjectId(uid)}):
            raise ValueError("Supplier not found")

        self.collection.update_one(
            {"_id": ObjectId(uid)}, 
            {"$set": {"rating": new_rating}}
        )
        return {"message": "Rating updated successfully"}

   
    # Rule: Cannot delete a supplier if 'pedidos' (orders) > 0.
    def delete(self, uid):
        current = self.collection.find_one({"_id": ObjectId(uid)})
        
        # Logic
        if current and current.get("pedidos", 0) > 0:
            raise ValueError("Business Rule: Cannot delete supplier with existing orders (pedidos > 0)")

        self.collection.delete_one({"_id": ObjectId(uid)})
        return {"message": "Supplier deleted"}