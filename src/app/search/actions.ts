"use server";

import { getProjectsAction, getTeamAction, getServicesAction, getBlogPostsAction } from "@/app/actions";
import { Project, TeamMember, Service, BlogPost } from "@/lib/types";

interface SearchResult {
  type: string;
  data: Project | TeamMember | Service | BlogPost;
}

interface SearchResultsData {
  results: SearchResult[];
  query: string;
  filters: string[];
}

// تم تعديل الدالة لتقبل query و filters بشكل مباشر
export async function getSearchResultsAction(query: string, filters: string[]): Promise<SearchResultsData> {
  const normalizedQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  const projects = await getProjectsAction();
  const teamMembers = await getTeamAction();
  const services = await getServicesAction();
  const blogPosts = await getBlogPostsAction();

  if (!normalizedQuery && filters.length === 0) {
    return { results: [], query, filters };
  }

  // Search in Projects
  if (filters.includes("portfolio")) {
    projects.forEach((project) => {
      if (
(project.title?.toLowerCase() || "").includes(normalizedQuery) ||
(project.description?.toLowerCase() || "").includes(normalizedQuery) ||
(project.category?.toLowerCase() || "").includes(normalizedQuery)

      ) {
        results.push({ type: "Project", data: project });
      }
    });
  }

  // Search in Team Members
  if (filters.includes("team")) {
    teamMembers.forEach((member) => {
      if (
(member.name?.toLowerCase() || "").includes(normalizedQuery) ||
(member.role?.toLowerCase() || "").includes(normalizedQuery)

      ) {
        results.push({ type: "TeamMember", data: member });
      }
    });
  }

  // Search in Services
  if (filters.includes("services")) {
    services.forEach((service) => {
      if (
(service.title?.toLowerCase() || "").includes(normalizedQuery) ||
(service.description?.toLowerCase() || "").includes(normalizedQuery)

      ) {
        results.push({ type: "Service", data: service });
      }
    });
  }

  // Search in Blog Posts
  if (filters.includes("blog")) {
    blogPosts.forEach((post) => {
      if (
(post.title?.toLowerCase() || "").includes(normalizedQuery) ||
(post.excerpt?.toLowerCase() || "").includes(normalizedQuery) ||
(post.content?.toLowerCase() || "").includes(normalizedQuery) ||
post.tags?.some(tag => (tag?.toLowerCase() || "").includes(normalizedQuery)) ||
(post.category?.toLowerCase() || "").includes(normalizedQuery)
      ) {
        results.push({ type: "BlogPost", data: post });
      }
    });
  }

  return { results, query, filters };
}