from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_full_business_logic():
    # 1. Create a Global Fallback Scorecard
    fallback_payload = {
        "name": "Global Fallback SC",
        "description": "This is fallback",
        "status": "Đang hoạt động",
        "is_global_fallback": True,
        "criteria": []
    }
    resp1 = client.post("/scorecards/", json=fallback_payload)
    assert resp1.status_code == 201
    fallback_id = resp1.json()["id"]

    # 2. Set it as global fallback via mappings API
    resp_fb = client.put("/mappings/global-fallback", json={"scorecard_id": fallback_id})
    assert resp_fb.status_code == 200

    # 3. Create a Specific Topic Scorecard
    specific_payload = {
        "name": "Specific SC",
        "description": "For specific topic",
        "status": "Đang hoạt động",
        "is_global_fallback": False,
        "criteria": []
    }
    resp2 = client.post("/scorecards/", json=specific_payload)
    assert resp2.status_code == 201
    specific_id = resp2.json()["id"]

    # 4. Map the specific scorecard to a topic
    mapping_payload = {
        "topic_id": "T-100",
        "topic_name": "Khoa SmartKids",
        "scorecard_id": specific_id
    }
    resp3 = client.post("/mappings/", json=mapping_payload)
    assert resp3.status_code == 201

    # 5. Test Scoring Logic with mapped topic
    # The topic name provided is identical
    resp_score1 = client.get("/scoring/scorecard?topic_name=Khoa SmartKids")
    assert resp_score1.status_code == 200
    assert resp_score1.json()["id"] == specific_id

    # Test Case Insensitivity if possible, but matching exact string first
    resp_score2 = client.get("/scoring/scorecard?topic_name=khoa smartkids")
    assert resp_score2.status_code == 200
    assert resp_score2.json()["id"] == specific_id

    # 6. Test Scoring Logic with unmapped topic -> should return fallback
    resp_score3 = client.get("/scoring/scorecard?topic_name=Unknown Topic")
    assert resp_score3.status_code == 200
    assert resp_score3.json()["id"] == fallback_id

    print("All business logic verified successfully!")

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200

def test_ai_mock_generation():
    response = client.post("/ai/generate-scorecard", json={"raw_text": "This is a detailed business procedure step 1 step 2"})
    assert response.status_code == 200

if __name__ == "__main__":
    test_read_root()
    test_ai_mock_generation()
    test_full_business_logic()
    print("All tests passed.")
