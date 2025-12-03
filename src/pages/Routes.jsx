import React from "react";
import TestListPage from "./TestListPage";
import ExamPage from "./ExamPage";

export default function Routes() {
  // simple single-page - we show TestList and ExamPage conditionally via context
  return (
    <div>
      <TestListPage />
      <ExamPage />
    </div>
  );
}
