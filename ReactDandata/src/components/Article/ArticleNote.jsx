import React from "react";
import PropTypes from "prop-types";
import { Calendar, User, Star } from "lucide-react";
import "./ArticleNote.css";

export const ArticleNote = ({ article, nombreNotes }) => {
  return (
        <div className={`article-une-meta-item ${theme}_body ${theme}_texte`}>
                <Star className="article-une-icon" />
                <span>{article.nombreNotes || 0}</span>
              </div>
    );
};
    nombreNotes: PropTypes.number,
ArticleNote.propTypes = {
  article: PropTypes.shape({
    nombreNotes: PropTypes.number,
  }).isRequired,
};