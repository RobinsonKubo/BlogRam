import { getFirestore, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import app from "./app";

export const db = getFirestore(app);

/**
 * Firestoreから最新5件のコメントを投稿日時の降順で取得します。
 * @returns {Promise<Array<object>>} 取得したコメントデータの配列を返すPromise。
 */
export async function getLatestComments() {
    const commentsCol = collection(db, 'comments');
    const q = query(commentsCol, orderBy('timestamp', 'desc'), limit(5));
    
    try {
        const querySnapshot = await getDocs(q);
        const comments = [];
        querySnapshot.forEach((doc) => {
            comments.push({ id: doc.id, ...doc.data() });
        });
        return comments;
    } catch (error) {
        console.error("コメントの取得中にエラーが発生しました:", error);
        return [];
    }
}
