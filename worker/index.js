import * as posts from "../functions/api/posts/index.js";
import * as postById from "../functions/api/post/[id].js";
import * as postComments from "../functions/api/post/[id]/comments.js";
import * as authSignup from "../functions/api/auth/signup.js";
import * as authLogin from "../functions/api/auth/login.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;

    // /api/auth/signup (회원가입)
    if (url.pathname === "/api/auth/signup" && method === "POST") {
      return authSignup.onRequestPost({ request, env });
    }

    // /api/auth/login (로그인)
    if (url.pathname === "/api/auth/login" && method === "POST") {
      return authLogin.onRequestPost({ request, env });
    }

    // /api/posts (목록 조회 & 작성)
    if (url.pathname === "/api/posts") {
      if (method === "GET") return posts.onRequestGet({ env });
      if (method === "POST") return posts.onRequestPost({ request, env });
    }

    // /api/post/:id (상세 조회, 수정, 삭제)
    const postMatch = url.pathname.match(/^\/api\/post\/(\d+)$/);
    if (postMatch) {
      const id = postMatch[1];
      const params = { id };
      
      if (method === "GET") return postById.onRequestGet({ env, params });
      if (method === "PUT") return postById.onRequestPut({ env, params, request });
      if (method === "DELETE") return postById.onRequestDelete({ env, params, request });
    }

    // /api/post/:id/comments (댓글 조회 & 작성)
    const commentsMatch = url.pathname.match(/^\/api\/post\/(\d+)\/comments$/);
    if (commentsMatch) {
      const id = commentsMatch[1];
      const params = { id };
      
      if (method === "GET") return postComments.onRequestGet({ env, params });
      if (method === "POST") return postComments.onRequestPost({ env, params, request });
    }

    // 404
    return new Response(JSON.stringify({ message: "Not Found" }), { 
      status: 404,
      headers: { "content-type": "application/json" }
    });
  }
}
