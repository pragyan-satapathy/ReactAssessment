import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import PostDetails from "./PostDetails";

function App() {
  // state
  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState(0);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [paginationLinks, setPaginationLinks] = useState({});

  // function
  const heavyComputationOnEachItem = () => {
    let res = 0;
    for (let i = 0; i < 1000000; i++) {
      res += Math.random();
    }
    return res;
  };
  const fetchPosts = async (page = 1) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}`,
      );
      const data = await response.json();
      setPosts(data);

      const linkHeader = response.headers.get("Link");
      if (linkHeader) {
        const links = {};
        linkHeader.split(",").forEach((link) => {
          const [url, rel] = link.split(";").map((s) => s.trim());
          const page = parseInt(url.match(/_page=(\d+)/)[1]);
          links[rel] = page;
        });
        setPaginationLinks(links);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // useEffect
  useEffect(() => {
    fetchPosts();
  }, []);

  // useMemo

  // optimizedHeavyComputationOnEachItem executes, only when "posts" changes (to test you can change the page and see)
  // it won't get executed with other state variables except "posts" (you can increase and decrese counter to test.)
  const optimizedHeavyComputationOnEachItem = useMemo(() => {
    const startTime = performance.now();
    posts.map((post) => {
      const res = heavyComputationOnEachItem(post);
      post.randomNum = res;
      return post;
    });
    const endTime = performance.now();
    console.log("total computation time: ", endTime - startTime);
    return posts;
  }, [posts]);

  // useCallback

  // here, if I pass 'callbackFunc' as props to "PostDetails" => state/props update in App.js => rerender "PostDetails"
  // if I pass 'optimizedCallbackFunc' as props => state/props update in App.js => won't cause rerender of "PostDetails"
  // if you want to rerender it with a particular state or props change, then pass that to dependecy array of useCallback
  // you can increase or decrease counter to test
  const callbackFunc = () => {
    console.log("callbackFunc Excuted");
  };
  const optimizedCallbackFunc = useCallback(callbackFunc, []);

  return (
    <div className="container">
      <div className="button-container">
        <button onClick={() => setCount(count - 1)}>-</button>
        {count}
        <button onClick={() => setCount(count + 1)}>+</button>
        <button onClick={() => setSelectedPostId(null)}>
          Reset Post Selection
        </button>
      </div>
      {selectedPostId && (
        <PostDetails
          postId={selectedPostId}
          optimizedCallbackFunc={optimizedCallbackFunc}
        />
      )}
      <ul className="post-list">
        {optimizedHeavyComputationOnEachItem.map((post) => (
          <li
            key={post?.id}
            onClick={() => setSelectedPostId(post.id)}
            style={{ cursor: "pointer" }}
          >
            <div>id: {post?.id}</div>
            <div>userId: {post?.userId}</div>
            <div>title: {post?.title}</div>
            <div>body: {post?.body}</div>
            <div>randomNum: {post?.randomNum}</div>
          </li>
        ))}
      </ul>
      <div className="button-container">
        {paginationLinks[`rel="prev"`] && (
          <button onClick={() => fetchPosts(paginationLinks[`rel="prev"`])}>
            Previous
          </button>
        )}
        {paginationLinks[`rel="next"`] && (
          <button onClick={() => fetchPosts(paginationLinks[`rel="next"`])}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
