// CommentVideo.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog, DialogHeader, DialogBody, DialogFooter,
  Card, Input, Button, Typography, Spinner,
} from "@material-tailwind/react";

/* ---------- Cấu hình ---------- */
const BASE = "https://api-ndolv2.nongdanonline.vn/video-comment";
const token = () => localStorage.getItem("token");

/* ---------- Hàm API ---------- */
const fetchComments = (videoId) =>
  axios
    .get(`${BASE}/${videoId}/comments`, {
      headers: { Authorization: `Bearer ${token()}` },
    })
    .then((r) => r.data);

const addComment = (videoId, body) =>
  axios.post(`${BASE}/${videoId}/comment`, body, {
    headers: { Authorization: `Bearer ${token()}` },
  });

const replyComment = (videoId, commentIndex, body) => axios.post(`${BASE}/${videoId}/comment/${commentIndex}/reply`, body ,{
    headers: {Authorization: `Bearer ${token()}`},
  })

const hideComment = (videoId, commentIndex) => axios.delete(`${BASE}/${videoId}/comment/${commentIndex}`, {
    headers: { Authorization: `Bearer ${token()}` },
})

const hideReply = (videoId, commentIndex, replyIndex) =>
  axios.delete(`${BASE}/${videoId}/comment/${commentIndex}/reply/${replyIndex}`, {
    headers: { Authorization: `Bearer ${token()}` },
  });

/* ---------- Component ---------- */
export default function CommentVideo({ open, onClose, videoId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newComment, setNewComment] = useState("");
  const [replyBox, setReplyBox] = useState({commentIndex: null, text: ""})

  const load = () => {
    if (!videoId) return;
    setLoading(true);
    fetchComments(videoId).then(setComments).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (open) load();
  }, [open, videoId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await addComment(videoId, { content: newComment });
    setNewComment("");
    load();
  };


  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyBox.text.trim()) return;
    await replyComment(videoId, replyBox.idx, { content: replyBox.text });
    setReplyBox({ idx: null, text: "" });
    load();
  };


  const handleHideComment = async (idx) => {
    await hideComment(videoId, idx);
    load();
  };
  const handleHideReply = async (cIdx, rIdx) => {
    await hideReply(videoId, cIdx, rIdx);
    load();
  };

  return (
    <Dialog open={open} handler={onClose} size="lg">
      <DialogHeader>Bình luận video</DialogHeader>

      <DialogBody className="h-[70vh] overflow-y-auto">
        {/* Form nhập bình luận */}
        <Card shadow={false} className="p-4 bg-gray-50">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              label="Viết bình luận..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" color="blue">
              Gửi
            </Button>
          </form>
        </Card>

        {/* Danh sách */}
        {loading ? (
          <div className="flex justify-center pt-8">
            <Spinner />
          </div>
        ) : comments.length === 0 ? (
          <Typography className="text-center mt-6" color="gray">
            Chưa có bình luận.
          </Typography>
        ) : (
          <ul className="mt-6 space-y-3">
            {comments.map((c, i) => (
              <li key={i} className="bg-white p-3 rounded shadow">
                <Typography className="font-medium">{c.author}</Typography>
                <Typography>{c.content}</Typography>

                {c.replies?.map((r, j) => (
                  <div
                    key={j}
                    className="ml-4 mt-2 p-2 bg-gray-100 rounded text-sm"
                  >
                    <span className="font-medium">{r.author}: </span>
                    {r.content}
                  </div>
                ))}
              </li>
            ))}
          </ul>
        )}
      </DialogBody>

      <DialogFooter>
        <Button color="blue" onClick={onClose}>
          Đóng
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
