import React from 'react';

export const VideoDetail = ({ getDetailVideoInformation }) => {
  if (!getDetailVideoInformation) return null;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Tiêu đề</label>
        <input
          value={getDetailVideoInformation.title || ""}
          className="border border-blue-200 px-3 py-2 rounded w-full bg-gray-50 text-gray-800 font-medium"
          disabled
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">YouTube Link</label>
        <input
          value={getDetailVideoInformation.youtubeLink || ""}
          className="border border-blue-200 px-3 py-2 rounded w-full bg-gray-50 text-blue-700 font-medium"
          disabled
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Playlist Name</label>
        <input
          value={getDetailVideoInformation.playlistName || ""}
          className="border border-blue-200 px-3 py-2 rounded w-full bg-gray-50 text-gray-800 font-medium"
          disabled
        />
      </div>
      <div className="flex flex-col gap-1 mt-2 text-gray-600 text-sm">
        <span><span className="font-semibold">Trạng thái:</span> {getDetailVideoInformation.status}</span>
        <span><span className="font-semibold">Người đăng:</span> {getDetailVideoInformation.uploadedBy}</span>
        <span><span className="font-semibold">Ngày tạo:</span> {getDetailVideoInformation.createdAt && new Date(getDetailVideoInformation.createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
};

export default VideoDetail;
