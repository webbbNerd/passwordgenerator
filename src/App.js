import React, { useState, useEffect } from "react";
import { Input, Checkbox, Button, message } from "antd";
import "./App.css";

const App = () => {
  const [password, setPassword] = useState("");
  const [includeNum, setIncludeNum] = useState(false);
  const [includeAlpha, setIncludeAlpha] = useState(true);
  const [includeSpecialChar, setIncludeSpecialChar] = useState(false);
  const [previousPasswords, setPreviousPasswords] = useState([]);

  useEffect(() => {
    const localPass = localStorage.getItem("LocalStoragePasswords");
    if (localPass) {
      setPreviousPasswords(JSON.parse(localPass));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "LocalStoragePasswords",
      JSON.stringify(previousPasswords)
    );
  }, [previousPasswords]);

  const generatePassword = () => {
    const numbers = "0123456789";
    const alphabets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const specialChars = "!@#$%^&*()_-+=";

    let charInclueded = "";

    if (includeNum) {
      charInclueded += numbers;
    }

    if (includeAlpha) {
      charInclueded += alphabets;
    }

    if (includeSpecialChar) {
      charInclueded += specialChars;
    }

    if (charInclueded.length === 0) {
      message.error("Please select at least one option");
      return;
    }

    let generatedPassword = "";
    const passwordLength = 10;

    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * charInclueded.length);
      generatedPassword += charInclueded[randomIndex];
    }

    setPassword(generatedPassword);
    setPreviousPasswords((prevPasswords) => [
      generatedPassword,
      ...prevPasswords.slice(0, 4),
    ]);
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(password)
      .then(() => {
        message.success("Password copied to clipboard");
      })
      .catch((error) => {
        message.error("Failed to copy password to clipboard");
        console.error(error);
      });
  };

  return (
    <div class="container">
      <div
        style={{
          border: "1px solid #b6b6b6",
          padding: "20px",
          height: "80vh",
          borderRadius: "12px",
          backgroundColor: "#f3f3f3",
        }}
      >
        <h1>Random Password Generator</h1>
        <div style={{ marginBottom: "30px" }}>
          <Checkbox
            checked={includeNum}
            onChange={(e) => setIncludeNum(e.target.checked)}
          >
            Include Numbers
          </Checkbox>
          <Checkbox
            checked={includeAlpha}
            onChange={(e) => setIncludeAlpha(e.target.checked)}
          >
            Include Alphabets
          </Checkbox>
          <Checkbox
            checked={includeSpecialChar}
            onChange={(e) => setIncludeSpecialChar(e.target.checked)}
          >
            Include Special Characters
          </Checkbox>
        </div>
        <Button
          type="primary"
          style={{ alignSelf: "center", width: "auto" }}
          onClick={() => {
            generatePassword();
          }}
        >
          Generate Password
        </Button>
        {password && (
          <div>
            <h1 style={{ color: "#165658" }}>{password}</h1>
            <Button
              style={{ color: "#0a0931" }}
              onClick={() => {
                copyToClipboard();
              }}
            >
              Copy to Clipboard
            </Button>
          </div>
        )}
        <h2>Previous Passwords</h2>
        <Button onClick={() => setPreviousPasswords([])}>
          Clear Passwords
        </Button>
        <ul
          style={{
            padding: 0,
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          {previousPasswords.map((prevPassword, index) => (
            <h4
              style={{
                border: "1px solid #c6c1c1",
                borderRadius: "6px",
                padding: "10px",
                background: "antiquewhite",
              }}
              key={index}
            >
              {prevPassword}
            </h4>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
