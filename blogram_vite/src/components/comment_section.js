import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Firestoreの初期化を行ったファイルからdbをインポート
import { collection, addDoc, getDocs } from 'firebase/firestore';

const CommentSection = () => {
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        const fetchComments = async () => {
            const commentsCollection = collection(db, 'comments');
            const commentsSnapshot = await getDocs(commentsCollection);
            const commentsList = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setComments(commentsList);
        };

        fetchComments();
    }, []);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (commentText.trim() === '') return;

        try {
            await addDoc(collection(db, 'comments'), {
                text: commentText,
                createdAt: new Date(),
            });
            setCommentText('');
            // コメントを再取得して表示を更新
            const commentsCollection = collection(db, 'comments');
            const commentsSnapshot = await getDocs(commentsCollection);
            const commentsList = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setComments(commentsList);
        } catch (error) {
            console.error("Error adding comment: ", error);
        }
    };

    return (
        <div className="comment-section">
            <h2>コメント</h2>
            <form onSubmit={handleCommentSubmit}>
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="コメントする..."
                    rows="4"
                    required
                />
                <button type="submit">コメントする</button>
            </form>
            <div className="comment-list">
                {comments.map(comment => (
                    <div key={comment.id} className="comment-item">
                        <p>{comment.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;