import {
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
  Upload,
  ArrowLeft,
  Send,
  Trash2,
  Bot,
  User,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useKnowledgeDocuments from "../hooks/useKnowledgeDocuments";
import { useAuth } from "../context/AuthContext";

import {
  uploadKnowledgeDocument,
  searchKnowledge,
  deleteKnowledgeDocument,
} from "../api/knowledge.api";


// ========================================
// Knowledge Page
// ========================================

const Knowledge = () => {
  const navigate = useNavigate();

  const {
    activeOrganizationId,
  } = useAuth();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useKnowledgeDocuments(
    activeOrganizationId
  );


  // ========================================
  // Upload State
  // ========================================

  const [
    selectedFile,
    setSelectedFile,
  ] = useState(null);

  const [
    isUploading,
    setIsUploading,
  ] = useState(false);

  const [
    uploadError,
    setUploadError,
  ] = useState("");

  const [
    uploadSuccess,
    setUploadSuccess,
  ] = useState("");


  // ========================================
  // Delete State
  // ========================================

  const [
    deletingDocumentId,
    setDeletingDocumentId,
  ] = useState(null);

  const [
    deleteError,
    setDeleteError,
  ] = useState("");


  // ========================================
  // AI Assistant State
  // ========================================

  const [
    question,
    setQuestion,
  ] = useState("");

  const [
    askedQuestion,
    setAskedQuestion,
  ] = useState("");

  const [
    answer,
    setAnswer,
  ] = useState("");

  const [
    askError,
    setAskError,
  ] = useState("");

  const [
    isAsking,
    setIsAsking,
  ] = useState(false);


  // ========================================
  // Knowledge Documents
  // ========================================

  const documents =
    data?.data || [];


  // ========================================
  // Knowledge Readiness
  // ========================================

  const hasReadyKnowledge =
    documents.some(
      (document) =>
        document.status === "READY"
    );


  // ========================================
  // Handle File Selection
  // ========================================

  const handleFileChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    setUploadError("");
    setUploadSuccess("");
    setDeleteError("");

    if (!file) {
      setSelectedFile(null);
      return;
    }


    // ========================================
    // Validate File Type
    // ========================================

    if (
      file.type !==
      "application/pdf"
    ) {
      setSelectedFile(null);

      setUploadError(
        "Only PDF files are allowed."
      );

      event.target.value = "";

      return;
    }


    // ========================================
    // Validate File Size
    // ========================================

    const maxFileSize =
      10 * 1024 * 1024;

    if (
      file.size >
      maxFileSize
    ) {
      setSelectedFile(null);

      setUploadError(
        "PDF file size must not exceed 10 MB."
      );

      event.target.value = "";

      return;
    }


    // ========================================
    // Store Selected File
    // ========================================

    setSelectedFile(file);
  };


  // ========================================
  // Handle Document Upload
  // ========================================

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError(
        "Please select a PDF file."
      );

      return;
    }

    if (!activeOrganizationId) {
      setUploadError(
        "No active organization selected."
      );

      return;
    }


    // ========================================
    // Reset Upload State
    // ========================================

    setUploadError("");
    setUploadSuccess("");
    setIsUploading(true);


    try {

      // ========================================
      // Upload PDF
      // ========================================

      await uploadKnowledgeDocument(
        selectedFile
      );


      // ========================================
      // Refresh Documents
      // ========================================

      await refetch();


      // ========================================
      // Reset File Selection
      // ========================================

      setSelectedFile(null);

      const fileInput =
        document.getElementById(
          "knowledge-pdf"
        );

      if (fileInput) {
        fileInput.value = "";
      }


      // ========================================
      // Show Success Message
      // ========================================

      setUploadSuccess(
        "Knowledge document uploaded and processed successfully."
      );

    } catch (uploadErrorResponse) {

      // ========================================
      // Handle Upload Error
      // ========================================

      setUploadError(
        uploadErrorResponse
          ?.response
          ?.data
          ?.message ||
          "Something went wrong while uploading the knowledge document."
      );

    } finally {

      // ========================================
      // Finish Upload State
      // ========================================

      setIsUploading(false);
    }
  };


  // ========================================
  // Handle Document Delete
  // ========================================

  const handleDelete = async (
    documentId,
    fileName
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${fileName}"?`
      );

    if (!confirmed) {
      return;
    }


    // ========================================
    // Reset Delete State
    // ========================================

    setDeleteError("");
    setDeletingDocumentId(
      documentId
    );


    try {

      // ========================================
      // Delete Knowledge Document
      // ========================================

      await deleteKnowledgeDocument(
        documentId
      );


      // ========================================
      // Refresh Documents
      // ========================================

      await refetch();


      // ========================================
      // Clear AI Response If Needed
      // ========================================

      setAskedQuestion("");
      setAnswer("");
      setAskError("");

    } catch (deleteErrorResponse) {

      // ========================================
      // Handle Delete Error
      // ========================================

      setDeleteError(
        deleteErrorResponse
          ?.response
          ?.data
          ?.message ||
          "Something went wrong while deleting the knowledge document."
      );

    } finally {

      // ========================================
      // Finish Delete State
      // ========================================

      setDeletingDocumentId(null);
    }
  };


  // ========================================
  // Handle Ask AI
  // ========================================

  const handleAskAI = async (
    event
  ) => {
    event.preventDefault();

    const trimmedQuestion =
      question.trim();


    // ========================================
    // Validate Question
    // ========================================

    if (!trimmedQuestion) {
      setAskError(
        "Please enter a question."
      );

      return;
    }

    if (!hasReadyKnowledge) {
      setAskError(
        "Company knowledge is not ready yet."
      );

      return;
    }


    // ========================================
    // Reset Previous Answer
    // ========================================

    setAskError("");
    setAnswer("");
    setAskedQuestion(
      trimmedQuestion
    );
    setIsAsking(true);


    try {

      // ========================================
      // Ask Company Knowledge AI
      // ========================================

      const response =
        await searchKnowledge(
          trimmedQuestion
        );


      // ========================================
      // Extract Grounded Answer
      // ========================================

      const generatedAnswer =
        response?.data?.answer;


      if (!generatedAnswer) {
        throw new Error(
          "AI provider returned an empty answer."
        );
      }


      // ========================================
      // Display Answer
      // ========================================

      setAnswer(
        generatedAnswer
      );

    } catch (askErrorResponse) {

      // ========================================
      // Handle AI Error
      // ========================================

      setAskError(
        askErrorResponse
          ?.response
          ?.data
          ?.message ||
          askErrorResponse?.message ||
          "Something went wrong while generating the answer."
      );

    } finally {

      // ========================================
      // Finish AI Request
      // ========================================

      setIsAsking(false);
    }
  };


  // ========================================
  // Loading State
  // ========================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">

        <main className="mx-auto max-w-7xl px-6 py-10">

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">

            <Loader2
              size={32}
              className="mx-auto mb-3 animate-spin text-blue-500"
            />

            <p className="text-sm text-slate-400">
              Loading company knowledge...
            </p>

          </div>

        </main>

      </div>
    );
  }


  // ========================================
  // Error State
  // ========================================

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">

        <main className="mx-auto max-w-7xl px-6 py-10">

          <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-10 text-center">

            <XCircle
              size={32}
              className="mx-auto mb-3 text-red-500"
            />

            <p className="font-medium">
              Unable to load company knowledge
            </p>

            <p className="mt-2 text-sm text-slate-400">
              {error?.response?.data?.message ||
                "Something went wrong while fetching knowledge documents."}
            </p>

          </div>

        </main>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-950 text-white">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-slate-800 bg-slate-950">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Page Identity */}

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">

              <FileText
                size={20}
              />

            </div>

            <div>

              <h1 className="font-bold">
                Company Knowledge
              </h1>

              <p className="text-xs text-slate-500">
                AI-powered company knowledge
              </p>

            </div>

          </div>


          {/* Back To Dashboard */}

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
          >

            <ArrowLeft
              size={17}
            />

            Dashboard

          </button>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10">


        {/* =================================================
            PAGE HEADING
        ================================================= */}

        <div className="mb-8">

          <p className="text-sm text-slate-500">
            Knowledge Base
          </p>

          <h2 className="mt-1 text-3xl font-bold">
            Company Knowledge
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Manage the documents used by
            SupportSphere's AI assistant.
          </p>

        </div>


        {/* =================================================
            UPLOAD DOCUMENT
        ================================================= */}

        <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-6">

          <div className="mb-5">

            <h3 className="text-xl font-semibold">
              Upload Knowledge Document
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Upload a company PDF to add it
              to your organization's knowledge base.
            </p>

          </div>


          {/* File Selection */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

            <div className="flex-1">

              <label
                htmlFor="knowledge-pdf"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Company PDF
              </label>

              <input
                id="knowledge-pdf"
                type="file"
                accept="application/pdf,.pdf"
                onChange={
                  handleFileChange
                }
                disabled={
                  isUploading
                }
                className="block w-full cursor-pointer rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <p className="mt-2 text-xs text-slate-500">
                PDF only · Maximum file size: 10 MB
              </p>

            </div>


            {/* Upload Button */}

            <button
              type="button"
              onClick={
                handleUpload
              }
              disabled={
                !selectedFile ||
                isUploading
              }
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {isUploading ? (

                <>

                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Uploading...

                </>

              ) : (

                <>

                  <Upload
                    size={18}
                  />

                  Upload PDF

                </>

              )}

            </button>

          </div>


          {/* Selected File */}

          {selectedFile && (
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 px-4 py-3">

              <FileText
                size={18}
                className="shrink-0 text-blue-400"
              />

              <div className="min-w-0">

                <p className="truncate text-sm font-medium text-slate-200">
                  {selectedFile.name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {(
                    selectedFile.size /
                    (1024 * 1024)
                  ).toFixed(2)}{" "}
                  MB
                </p>

              </div>

            </div>
          )}


          {/* Upload Error */}

          {uploadError && (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3">

              <XCircle
                size={18}
                className="mt-0.5 shrink-0 text-red-500"
              />

              <p className="text-sm text-red-400">
                {uploadError}
              </p>

            </div>
          )}


          {/* Upload Success */}

          {uploadSuccess && (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-green-900/50 bg-green-950/20 px-4 py-3">

              <CheckCircle
                size={18}
                className="mt-0.5 shrink-0 text-green-500"
              />

              <p className="text-sm text-green-400">
                {uploadSuccess}
              </p>

            </div>
          )}

        </section>


        {/* =================================================
            KNOWLEDGE STATUS
        ================================================= */}

        <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-6">

          <div className="flex items-start gap-4">

            {hasReadyKnowledge ? (

              <CheckCircle
                size={24}
                className="mt-0.5 shrink-0 text-green-500"
              />

            ) : (

              <XCircle
                size={24}
                className="mt-0.5 shrink-0 text-slate-500"
              />

            )}

            <div>

              <h3 className="font-semibold">

                {hasReadyKnowledge
                  ? "Company knowledge is ready"
                  : "Company knowledge is not ready"}

              </h3>

              <p className="mt-1 text-sm text-slate-400">

                {hasReadyKnowledge
                  ? "The AI assistant can answer questions using your uploaded company knowledge."
                  : "Upload and successfully process a company document to enable the AI assistant."}

              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            ASK COMPANY KNOWLEDGE
        ================================================= */}

        {hasReadyKnowledge && (

          <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-6">

            {/* Assistant Header */}

            <div className="mb-5 flex items-start gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600">

                <Bot
                  size={20}
                />

              </div>

              <div>

                <h3 className="text-xl font-semibold">
                  Ask Company Knowledge
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Ask questions about information contained
                  in your organization's uploaded documents.
                </p>

              </div>

            </div>


            {/* Question Form */}

            <form
              onSubmit={
                handleAskAI
              }
              className="flex flex-col gap-3 sm:flex-row"
            >

              <input
                type="text"
                value={question}
                onChange={(event) => {
                  setQuestion(
                    event.target.value
                  );

                  if (askError) {
                    setAskError("");
                  }
                }}
                placeholder="Ask a question about your company knowledge..."
                maxLength={1000}
                disabled={
                  isAsking
                }
                className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={
                  isAsking ||
                  !question.trim()
                }
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {isAsking ? (

                  <>

                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Thinking...

                  </>

                ) : (

                  <>

                    <Send
                      size={18}
                    />

                    Ask AI

                  </>

                )}

              </button>

            </form>


            {/* Character Count */}

            <div className="mt-2 text-right text-xs text-slate-600">
              {question.length}/1000
            </div>


            {/* AI Error */}

            {askError && (
              <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3">

                <XCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-red-500"
                />

                <p className="text-sm text-red-400">
                  {askError}
                </p>

              </div>
            )}


            {/* =================================================
                USER QUESTION
            ================================================= */}

            {askedQuestion && (
              <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-5">

                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-400">

                  <User
                    size={17}
                  />

                  Your Question

                </div>

                <p className="text-sm leading-6 text-slate-200">
                  {askedQuestion}
                </p>

              </div>
            )}


            {/* =================================================
                AI ANSWER
            ================================================= */}

            {answer && (
              <div className="mt-4 rounded-xl border border-blue-900/50 bg-slate-950 p-5">

                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-blue-400">

                  <Bot
                    size={17}
                  />

                  SupportSphere AI

                </div>

                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
                  {answer}
                </p>

              </div>
            )}

          </section>

        )}


        {/* =================================================
            DOCUMENTS
        ================================================= */}

        <section>

          <div className="mb-4">

            <h3 className="text-xl font-semibold">
              Knowledge Documents
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Documents available to your organization.
            </p>

          </div>


          {/* Delete Error */}

          {deleteError && (
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3">

              <XCircle
                size={18}
                className="mt-0.5 shrink-0 text-red-500"
              />

              <p className="text-sm text-red-400">
                {deleteError}
              </p>

            </div>
          )}


          {documents.length === 0 ? (

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">

              <FileText
                size={36}
                className="mx-auto mb-3 text-slate-600"
              />

              <p className="font-medium">
                No knowledge documents
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Upload a company PDF to create
                your knowledge base.
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {documents.map(
                (document) => (

                  <div
                    key={document.id}
                    className="rounded-xl border border-slate-800 bg-slate-900 p-5"
                  >

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                      {/* Document Information */}

                      <div className="flex min-w-0 items-start gap-4">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800">

                          <FileText
                            size={20}
                            className="text-slate-400"
                          />

                        </div>

                        <div className="min-w-0">

                          <h4 className="truncate font-medium">
                            {document.fileName}
                          </h4>

                          <p className="mt-1 text-xs text-slate-500">
                            {document.chunkCount} chunks
                          </p>

                        </div>

                      </div>


                      {/* Document Actions */}

                      <div className="flex items-center gap-3">

                        {/* Document Status */}

                        <span
                          className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                            document.status ===
                            "READY"
                              ? "bg-green-500/10 text-green-400"
                              : document.status ===
                                "PROCESSING"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {document.status}
                        </span>


                        {/* Delete Button */}

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              document.id,
                              document.fileName
                            )
                          }
                          disabled={
                            deletingDocumentId ===
                            document.id ||
                            isUploading
                          }
                          title="Delete document"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition hover:border-red-900/60 hover:bg-red-950/20 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          {deletingDocumentId ===
                          document.id ? (

                            <Loader2
                              size={17}
                              className="animate-spin"
                            />

                          ) : (

                            <Trash2
                              size={17}
                            />

                          )}

                        </button>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>

    </div>
  );
};


export default Knowledge;