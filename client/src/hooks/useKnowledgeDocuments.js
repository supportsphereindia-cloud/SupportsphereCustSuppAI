import { useQuery } from "@tanstack/react-query";

import {
  getKnowledgeDocuments,
} from "../api/knowledge.api";


// ========================================
// Knowledge Documents Query
// ========================================

/**
 * Fetch knowledge documents for the
 * active organization.
 *
 * The active organization ID is included
 * in the query key so React Query keeps
 * each organization's knowledge state isolated.
 */
const useKnowledgeDocuments = (
  activeOrganizationId
) => {
  return useQuery({
    queryKey: [
      "knowledge-documents",
      activeOrganizationId,
    ],

    queryFn: () =>
      getKnowledgeDocuments(),

    enabled:
      Boolean(activeOrganizationId),

    staleTime: 30 * 1000,
  });
};


// ========================================
// Exports
// ========================================

export default useKnowledgeDocuments;