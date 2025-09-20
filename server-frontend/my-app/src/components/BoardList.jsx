import React from 'react';
import { Link } from 'react-router-dom';

export default function BoardList({ boards }) {
  return (
    <div className="container mt-4">
      <div className="row">
        {boards.map((board) => (
          <div className="col-md-4 mb-3" key={board.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{board.title}</h5>
                <p className="card-text text-truncate">{board.content}</p>
                <Link to={`/boards/${board.id}`} className="btn btn-primary btn-sm">
                  자세히 보기
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
