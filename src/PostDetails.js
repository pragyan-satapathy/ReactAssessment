import { memo, useEffect, useState } from "react";

const PostDetails = ({ postId, optimizedCallbackFunc }) => {
    optimizedCallbackFunc()
    console.log("PostDetails component..")

    // state
    const [post, setPost] = useState({})

    // useEffect
    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/posts/" + postId)
            .then(res => res.json())
            .then(json => { setPost(json) })
            .catch(err => { console.log(err) })
    }, [postId]);

    return (
        <div>
            <h2>Details of Post: {post?.id}</h2>
            <ul>
                <li>id: {post?.id}</li>
                <li>userId: {post?.userId}</li>
                <li>title: {post?.title}</li>
                <li>body: {post?.body}</li>
            </ul>
        </div>
    );
};

export default memo(PostDetails)
