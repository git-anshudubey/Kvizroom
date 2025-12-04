import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import "./CreateTest.css";
import { createTest } from "../api/testApi";

export default function CreateTest() {
  const navigate = useNavigate();

  // Test details
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");

  // Form builder state
  const [questions, setQuestions] = useState([]);
  const [selectedType, setSelectedType] = useState("");

  // Add question
  const handleAddQuestion = () => {
    if (!selectedType) return;
    const newQuestion = {
      id: uuidv4(),
      type: selectedType,
      text: "",
      options:
        selectedType === "true-false"
          ? ["True", "False"].map((opt) => ({
            id: uuidv4(),
            text: opt,
            isCorrect: opt === "True",
          }))
          : ["dropdown", "mcq", "checkboxes"].includes(selectedType)
            ? [{ id: uuidv4(), text: "", isCorrect: false }]
            : [],
      required: false,
      file: null,
      previewUrl: null,
    };
    setQuestions((prev) => [...prev, newQuestion]);
    setSelectedType("");
  };

  // Handlers
  const handleQuestionChange = (id, field, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleOptionChange = (qId, optId, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
            ...q,
            options: q.options.map((o) =>
              o.id === optId ? { ...o, text: value } : o
            ),
          }
          : q
      )
    );
  };

  const addOption = (qId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
            ...q,
            options: [
              ...q.options,
              { id: uuidv4(), text: "", isCorrect: false },
            ],
          }
          : q
      )
    );
  };

  const removeOption = (qId, optId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? { ...q, options: q.options.filter((o) => o.id !== optId) }
          : q
      )
    );
  };

  const handleCorrectChange = (qId, optId, type) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        if (type === "mcq" || type === "true-false") {
          return {
            ...q,
            options: q.options.map((o) => ({
              ...o,
              isCorrect: o.id === optId,
            })),
          };
        } else if (type === "checkboxes") {
          return {
            ...q,
            options: q.options.map((o) =>
              o.id === optId ? { ...o, isCorrect: !o.isCorrect } : o
            ),
          };
        }
        return q;
      })
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
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id && q.previewUrl) {
          URL.revokeObjectURL(q.previewUrl); // cleanup
        }
        return q;
      }).filter((q) => q.id !== id)
    );
  };

  const handleFileChange = (id, file) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          if (q.previewUrl) URL.revokeObjectURL(q.previewUrl); // cleanup
          return {
            ...q,
            file,
            previewUrl: URL.createObjectURL(file),
          };
        }
        return q;
      })
    );
  };

  // Format questions for backend
  const getFormattedQuestions = () => {
    return questions.map((q) => {
      const base = {
        id: q.id,
        type: q.type,
        text: q.text.trim(),
        required: q.required,
        options: q.options || [],
      };
      if (q.file) {
        base.fileName = q.file.name;
      }
      return base;
    });
  };

  // Submit test
  const handleSubmit = async () => {
    if (!title.trim() || !date || !time || Number(duration) <= 0) {
      alert("Please fill all test details correctly");
      return;
    }

    if (questions.length === 0) {
      alert("Please add at least one question");
      return;
    }

    for (let q of questions) {
      if (!q.text.trim()) {
        alert("All questions must have text");
        return;
      }
      if (
        ["mcq", "checkboxes", "dropdown"].includes(q.type) &&
        (!q.options ||
          q.options.length === 0 ||
          q.options.some((o) => !o.text.trim()))
      ) {
        alert("All options must have text");
        return;
      }
    }

    const startTime = new Date(`${date}T${time}`).toISOString();
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("duration", Number(duration));
    formData.append("startTime", startTime);

    const formattedQuestions = getFormattedQuestions();
    formData.append(
      "questions",
      JSON.stringify(
        formattedQuestions.map(({ fileName, ...rest }) => rest)
      )
    );

    // Attach files
    questions.forEach((q, idx) => {
      if (q.file) {
        formData.append("files", q.file);
      }
    });

    // ✅ Updated API call using createTest from testApi.js
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to create a test");
        navigate("/login");
        return;
      }

      const data = await createTest(formData, token);

      alert("Test created successfully!");
      setTitle("");
      setDate("");
      setTime("");
      setDuration("");
      setQuestions([]);
      navigate("/admin/manage-tests", { state: { newTest: data } });

    } catch (err) {
      console.error(err);
      alert(err.message || "Error creating test");
    }
  };


  return (
    <div className="create-test-container">
      <h2>Create New Test</h2>

      {/* Test Details */}
      <div className="test-details">
        <input
          type="text"
          placeholder="Test Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        <input
          type="number"
          placeholder="Duration (in minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </div>

      {/* Questions */}
      <h3>Questions</h3>
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
            q.type === "checkboxes" ||
            q.type === "true-false") && (
              <div className="options-section">
                {q.options.map((opt) => (
                  <div key={opt.id} className="option-item">
                    <input
                      type="text"
                      placeholder="Option text"
                      value={opt.text}
                      onChange={(e) =>
                        handleOptionChange(q.id, opt.id, e.target.value)
                      }
                    />
                    {(q.type !== "true-false" || q.type === "mcq") && (
                      <input
                        type={q.type === "checkboxes" ? "checkbox" : "radio"}
                        name={`correct-${q.id}`}
                        checked={opt.isCorrect}
                        onChange={() =>
                          handleCorrectChange(q.id, opt.id, q.type)
                        }
                      />
                    )}
                    <button onClick={() => removeOption(q.id, opt.id)}>❌</button>
                  </div>
                ))}
                {q.type !== "true-false" && (
                  <button onClick={() => addOption(q.id)}>Add Option</button>
                )}
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
              {q.previewUrl && q.type === "image" && (
                <img
                  src={q.previewUrl}
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

      {/* Add Question */}
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

      {/* Submit */}
      <button className="create-test-btn" onClick={handleSubmit}>
        Create Test
      </button>
    </div>
  );
}
