import {
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

import useKnowledgeDocuments from "../hooks/useKnowledgeDocuments";
import { useAuth } from "../context/AuthContext";


// ========================================
// Knowledge Page
// ========================================

const Knowledge = () => {
  const {
    activeOrganizationId,
  } = useAuth();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useKnowledgeDocuments(
    activeOrganizationId
  );

  const documents =
    data?.data || [];

  const hasReadyKnowledge =
    documents.some(
      (document) =>
        document.status === "READY"
    );


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

              <FileText size={20} />

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
                  ? "The AI assistant can use your uploaded company knowledge."
                  : "Upload and successfully process a company document to enable the AI assistant."}

              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            DOCUMENTS
        ================================================= */}

        <section>

          <div className="mb-4 flex items-center justify-between">

            <div>

              <h3 className="text-xl font-semibold">
                Knowledge Documents
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Documents available to your organization.
              </p>

            </div>

          </div>


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