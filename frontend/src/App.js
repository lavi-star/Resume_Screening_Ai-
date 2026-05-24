import React, { useState } from "react";

import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

function App() {

  const [file, setFile] = useState(null);

  const [jobDescription, setJobDescription] = useState("");

  const [result, setResult] = useState(null);

  const handleUpload = async () => {

    const formData = new FormData();

    formData.append("file", file);

    formData.append("job_description", jobDescription);

    const response = await fetch(
      "http://127.0.0.1:8000/upload-resume",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    setResult(data);
  };

  return (

    <div className="min-h-screen bg-blue-100 flex justify-center items-center p-6">

      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-6xl">

        <h1 className="text-6xl font-bold text-center text-blue-700 mb-10">
          AI Resume Screening System
        </h1>

        <textarea
          className="w-full border-2 border-blue-400 rounded-2xl p-5 h-56 text-lg"
          placeholder="Paste Job Description Here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <div className="flex gap-6 items-center mt-6">

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button
            onClick={handleUpload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-lg font-semibold"
          >
            Upload Resume
          </button>

        </div>

        {result && (

          <div className="mt-10">

            {/* SCORE SECTION */}

            <div className="bg-green-100 rounded-3xl p-8 shadow-lg flex flex-col items-center">

              <div style={{ width: 180, height: 180 }}>

                <CircularProgressbar
                  value={result.match_score}
                  text={`${result.match_score}%`}
                  styles={buildStyles({
                    textSize: "18px",
                    pathColor: "#16a34a",
                    textColor: "#166534",
                    trailColor: "#d1fae5",
                  })}
                />

              </div>

              <h2 className="text-3xl font-bold text-green-700 mt-6">
                Resume Match Score
              </h2>

              <p className="text-lg text-gray-700 mt-2">
                {result.recommendation}
              </p>

              <p className="text-blue-700 mt-3 font-semibold">
                NLP Similarity Score: {result.similarity_score}%
              </p>

            </div>

            {/* SKILLS SECTION */}

            <div className="grid md:grid-cols-2 gap-6 mt-8">

              {/* Extracted Skills */}

              <div className="bg-blue-50 p-5 rounded-2xl shadow">

                <h3 className="text-2xl font-bold mb-3 text-blue-700">
                  Extracted Skills
                </h3>

                <ul>
                  {result.extracted_skills.map((skill, index) => (
                    <li key={index}>✅ {skill}</li>
                  ))}
                </ul>

              </div>

              {/* Matched Skills */}

              <div className="bg-green-50 p-5 rounded-2xl shadow">

                <h3 className="text-2xl font-bold mb-3 text-green-700">
                  Matched Skills
                </h3>

                <ul>
                  {result.matched_skills.map((skill, index) => (
                    <li key={index}>✔️ {skill}</li>
                  ))}
                </ul>

              </div>

              {/* Missing Skills */}

              <div className="bg-red-50 p-5 rounded-2xl shadow">

                <h3 className="text-2xl font-bold mb-3 text-red-700">
                  Missing Skills
                </h3>

                <ul>
                  {result.missing_skills.map((skill, index) => (
                    <li key={index}>❌ {skill}</li>
                  ))}
                </ul>

              </div>

              {/* Recommendations */}

              <div className="bg-yellow-50 p-5 rounded-2xl shadow">

                <h3 className="text-2xl font-bold mb-3 text-yellow-700">
                  Recommendations
                </h3>

                <ul>
                  {result.recommendations.map((rec, index) => (
                    <li key={index}>⭐ {rec}</li>
                  ))}
                </ul>

              </div>

            </div>

            {/* RESUME TEXT */}

            <div className="bg-gray-100 mt-8 p-5 rounded-2xl shadow">

              <h3 className="text-2xl font-bold mb-3">
                Extracted Resume Text
              </h3>

              <p className="text-gray-700 whitespace-pre-wrap">
                {result.resume_text}
              </p>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default App;