function Comment({ comment }) {
    return (
        <div className="comment">
            <p><strong>{comment.author}:</strong> {comment.text}</p>
            <span className="comment-time">{comment.time}</span>
        </div>
    );
}
export default Comment;