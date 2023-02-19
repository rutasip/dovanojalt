import React from "react";
import { InputGroup, Button, FormControl } from "react-bootstrap";

function ChatInput({ chatMessage, setChatMessage, onChatSubmit }) {
  return (
    <InputGroup className="mt-4">
      <FormControl
        aria-label="message"
        aria-describedby="chat-input"
        value={chatMessage}
        onChange={(e) => {
          setChatMessage(e.target.value);
        }}
      />
      <InputGroup.Append>
        <Button variant="outline-secondary" onClick={onChatSubmit}>
          Siųsti
        </Button>
      </InputGroup.Append>
    </InputGroup>
  );
};

export default ChatInput;
