# 💬 Chat & Conversations API

Endpoints for interacting with the AI agent to build audience segments.

## 🧵 List Conversations

Retrieves all audience building sessions for the authenticated user.

- **URL**: `/chat/conversations`
- **Method**: `GET`
- **Auth required**: Yes

### 📥 List Conversations Success Response

- **Code**: 200 OK
- **Content**:

```json
{
  "success": true,
  "data": [
    {
      "id": "conv_01",
      "title": "Summer Campaign - Gen Z",
      "updatedAt": "2024-05-12T10:00:00Z"
    }
  ]
}
```

---

## ✉️ Send Message

Sends a natural language prompt to the AI agent. The agent will respond with a text message and potentially a list of suggested taxonomy signals.

- **URL**: `/chat/messages`
- **Method**: `POST`
- **Auth required**: Yes

### Request Body

```json
{
  "conversationId": "conv_01", // Optional: ommit to start new conversation
  "content": "I want to target people in California who bought hiking gear recently."
}
```

### 📥 Send Message Success Response

- **Code**: 201 Created
- **Content**:

```json
{
  "success": true,
  "data": {
    "id": "msg_02",
    "role": "agent",
    "content": "I've analyzed your request. Based on our taxonomy, I recommend these segments...",
    "metadata": {
      "suggestedSignals": [
        { "id": "loc_ca", "name": "California", "type": "location" },
        {
          "id": "trans_hiking",
          "name": "Outdoor & Hiking",
          "type": "transaction"
        }
      ]
    }
  }
}
```

---

## 📖 Get Conversation History

Retrieves all messages for a specific conversation.

- **URL**: `/chat/conversations/:id`
- **Method**: `GET`
- **Auth required**: Yes

### 📥 Get History Success Response

- **Code**: 200 OK
- **Content**:

```json
{
  "success": true,
  "data": {
    "id": "conv_01",
    "messages": [
      { "role": "user", "content": "Hello" },
      {
        "role": "agent",
        "content": "How can I help you build an audience today?"
      }
    ]
  }
}
```

---

## ⚡ Stream AI Response (SSE)

Streams the AI response in real-time. Useful for "typing" effects in the UI.

- **URL**: `/chat/conversations/:id/stream`
- **Method**: `GET`
- **Auth required**: Yes
- **Query Params**: `content` (string) - The user's prompt.

### 📥 Stream Events

The endpoint returns a `text/event-stream`. Events are JSON-encoded.

**Chunk Event:**

```json
{ "data": { "chunk": "I recommended " } }
```

**Completion Event:**

```json
{ "data": { "done": true } }
```

**Error Event:**

```json
{ "data": { "error": "Streaming failed" } }
```
