# 🌳 Taxonomy & Signals API

Endpoints for searching and exploring the audience targeting taxonomy.

## 📍 Locations

Search or list geographical targeting signals (Country > State > City).

- **URL**: `/taxonomy/locations`
- **Method**: `GET`
- **Auth required**: Yes

### 🔍 Locations Query Parameters

| Parameter | Type   | Description                                 |
| :-------- | :----- | :------------------------------------------ |
| `q`       | string | Optional. Search query (e.g., "California") |

### 📥 Locations Success Response

- **Code**: 200 OK
- **Content**:

```json
{
  "success": true,
  "data": [
    {
      "id": "loc_01",
      "name": "California",
      "path": "USA > California",
      "type": "location"
    }
  ]
}
```

---

## 💳 Transactions

Search or list spending/categorical signals.

- **URL**: `/taxonomy/transactions`
- **Method**: `GET`
- **Auth required**: Yes

### 🔍 Transactions Query Parameters

| Parameter | Type   | Description                              |
| :-------- | :----- | :--------------------------------------- |
| `q`       | string | Optional. Search query (e.g., "Grocery") |

### 📥 Transactions Success Response

- **Code**: 200 OK
- **Content**:

```json
{
  "success": true,
  "data": [
    {
      "id": "trans_01",
      "name": "Luxury Retail",
      "path": "Retail > Luxury",
      "type": "transaction"
    }
  ]
}
```

---

## 📊 Estimate Reach (Coming Soon)

Calculates the estimated reachable audience size for a combination of signals.

- **URL**: `/taxonomy/estimate`
- **Method**: `POST`
- **Auth required**: Yes

### Request Body

```json
{
  "signalIds": ["loc_01", "trans_hiking"]
}
```
