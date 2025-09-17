import mongoose, { Document, Schema, Types } from 'mongoose';

// Interface for blog comments
export interface IBlogComment {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for blog likes
export interface IBlogLike {
  user: Types.ObjectId;
  createdAt: Date;
}

// Interface for the Blog document
export interface IBlog extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  image?: string;
  video?: string;
  author: Types.ObjectId;
  tags: string[];
  likes: IBlogLike[];
  comments: IBlogComment[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Virtual fields
  likesCount: number;
  commentsCount: number;
}

// Schema for blog comments
const BlogCommentSchema = new Schema<IBlogComment>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: [500, 'Comment cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

// Schema for blog likes
const BlogLikeSchema = new Schema<IBlogLike>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Main Blog schema
const BlogSchema = new Schema<IBlog>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [2000, 'Content cannot be more than 2000 characters']
  },
  image: {
    type: String,
    default: ''
  },
  video: {
    type: String,
    default: ''
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: {
    type: [BlogLikeSchema],
    default: []
  },
  comments: {
    type: [BlogCommentSchema],
    default: []
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for likes count
BlogSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

// Virtual for comments count
BlogSchema.virtual('commentsCount').get(function() {
  return this.comments.length;
});

// Index for better query performance
BlogSchema.index({ author: 1, createdAt: -1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ isPublic: 1, createdAt: -1 });

// Ensure virtual fields are serialized
BlogSchema.set('toJSON', { virtuals: true });
BlogSchema.set('toObject', { virtuals: true });

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
