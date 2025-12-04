import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./TestBuilderPage.css";

export default function TestBuilderPage({ onQuestionsChange }) {
  const [questions, setQuestions] = useState([]);
  const [selectedType, setSelectedType] = useState("");

  const handleAddQuestion = () => {
    if (!selectedType) return;
    const newQuestion = {
      id: uuidv4(),
      type: selectedType,
      text: "",
      options:
        selectedType === "true-false"
          ? ["True", "False"]
          : ["dropdown", "mcq", "checkboxes"].includes(selectedType)
          ? [""]
          : [],
      answer: selectedType === "true-false" ? "True" : "",
      required: false,
      file: null,
    };
    setQuestions((prev) => [...prev, newQuestion]);
    setSelectedType("");
  };

  const handleQuestionChange = (id, field, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleOptionChange = (id, index, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              options: q.options.map((opt, i) =>
                i === index ? value : opt
              ),
            }
          : q
      )
    );
  };

  const addOption = (id) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  const removeOption = (id, index) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, options: q.options.filter((_, i) => i !== index) }
          : q
      )
    );
  };

  const moveQuestion = (index, direction) => {
    const newQuestions = [...questions];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= questions.length) return;
    [newQuestions[index], newQuestions[targetIndex]] = [
      newQuestions[targetIndex],
      newQuestions[index],
    ];
    setQuestions(newQuestions);
  };

  const deleteQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleFileChange = (id, file) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, file } : q))
    );
  };

  const handleSave = () => {
    if (onQuestionsChange) {
      onQuestionsChange(questions);
    }
  };

  return (
    <div className="builder-container">
      <h3>Add Questions</h3>

      {questions.map((q, index) => (
        <div key={q.id} className="question-card">
          <div className="question-header">
            <strong>Q{index + 1}.</strong>
            <input
              type="text"
              placeholder="Enter question text"
              value={q.text}
              onChange={(e) =>
                handleQuestionChange(q.id, "text", e.target.value)
              }
            />
          </div>

          {(q.type === "dropdown" ||
            q.type === "mcq" ||
            q.type === "checkboxes") && (
            <div className="options-section">
              {q.options.map((opt, i) => (
                <div key={i} className="option-item">
                  <input
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(q.id, i, e.target.value)
                    }
                  />
                  <button onClick={() => removeOption(q.id, i)}>❌</button>
                </div>
              ))}
              <button onClick={() => addOption(q.id)}>Add Option</button>
            </div>
          )}

          {(q.type === "file" || q.type === "image") && (
            <div className="upload-section">
              <input
                type="file"
                accept={q.type === "image" ? "image/*" : undefined}
                onChange={(e) =>
                  handleFileChange(q.id, e.target.files[0])
                }
              />
              {q.file && q.type === "image" && (
                <img
                  src={URL.createObjectURL(q.file)}
                  alt="preview"
                  className="preview-image"
                />
              )}
            </div>
          )}

          <label>
            Required:
            <input
              type="checkbox"
              checked={q.required}
              onChange={(e) =>
                handleQuestionChange(q.id, "required", e.target.checked)
              }
            />
          </label>

          <div className="question-actions">
            <button onClick={() => moveQuestion(index, -1)}>⬆</button>
            <button onClick={() => moveQuestion(index, 1)}>⬇</button>
            <button onClick={() => deleteQuestion(q.id)}>🗑</button>
          </div>
        </div>
      ))}

      <div className="type-selector">
        <label>Select Question Type:</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">-- Choose Type --</option>
          <option value="short-answer">Short Answer</option>
          <option value="paragraph">Paragraph</option>
          <option value="true-false">True / False</option>
          <option value="dropdown">Dropdown</option>
          <option value="mcq">Single Correct (MCQ)</option>
          <option value="checkboxes">Multiple Correct (Checkboxes)</option>
          <option value="file">Document Upload</option>
          <option value="image">Image Upload</option>
        </select>
        <button
          type="button"
          onClick={handleAddQuestion}
          disabled={!selectedType}
        >
          Add Question
        </button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleSave}>Save Questions</button>
      </div>
    </div>
  );
}
