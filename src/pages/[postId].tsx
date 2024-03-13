// pages/[postId].tsx

import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import ky from 'ky';

type Post = {
    userId: number;
    id: number;
    title: string;
    body: string;
};

type Props = {
    post: Post;
};

const PostPage: NextPage<Props> = ({ post }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [postData, setPostData] = useState<Post | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const response = await ky.get(`https://jsonplaceholder.typicode.com/posts/${post.id}`).json<Post>();
                setPostData(response);
            } catch (error) {
                // @ts-ignore
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [post.id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!postData) return null;

    return (
        <div>
            <h1>{postData.title}</h1>
            <p>{postData.body}</p>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
    const postId = params?.postId as string;
    const postResponse = await ky.get(`https://jsonplaceholder.typicode.com/posts/${postId}`).json<Post>();
    return {
        props: {
            post: postResponse,
        },
    };
};

export default PostPage;
