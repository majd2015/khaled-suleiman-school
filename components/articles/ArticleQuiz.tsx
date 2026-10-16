"use client";
import { useId, useState } from "react";
import type { Article } from "@/lib/articles";
export default function ArticleQuiz({
  question,
}: {
  question: Article["question"];
}) {
  const id = useId();
  const [answer, setAnswer] = useState<number | null>(null),
    [checked, setChecked] = useState(false);
  return (
    <form
      className="article-quiz"
      onSubmit={(e) => {
        e.preventDefault();
        if (answer !== null) setChecked(true);
      }}
    >
      <span className="eyebrow">وقفة تفكير</span>
      <fieldset>
        <legend>{question.text}</legend>
        {question.options.map((option, i) => (
          <label
            key={option}
            className={"quiz-option" + (answer === i ? " selected" : "")}
          >
            <input
              type="radio"
              name={id}
              value={i}
              required
              checked={answer === i}
              onChange={() => {
                setAnswer(i);
                setChecked(false);
              }}
            />
            <span>{option}</span>
          </label>
        ))}
      </fieldset>
      <button className="btn" type="submit">
        تحقّق من فهمك
      </button>
      {checked && (
        <div className="quiz-feedback" role="status">
          <strong>
            {answer === question.correctIndex
              ? "أحسنت، هذا صحيح."
              : "لنراجع الفكرة معًا."}
          </strong>
          <p>{question.explanation}</p>
          {answer !== question.correctIndex && (
            <p>الإجابة: {question.options[question.correctIndex]}</p>
          )}
        </div>
      )}
      <p className="field-note">
        تجربة للتعلّم؛ لا تُرسل الإجابات أو تُحفظ كعلامات.
      </p>
    </form>
  );
}
