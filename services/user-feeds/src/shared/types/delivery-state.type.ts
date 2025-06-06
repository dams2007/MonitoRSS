import { ArticleDeliveryErrorCode } from "../constants";
import { ArticleDeliveryContentType } from "./article-delivery-content-type.type";
import { Article } from "./article.type";

export enum ArticleDeliveryStatus {
  // The article is being delivered
  PendingDelivery = "pending-delivery",
  Sent = "sent",
  // An error happened within this service
  Failed = "failed",
  // Discord returns a 400 for example. Requires user action.
  Rejected = "rejected",
  // Filters blocked the article from getting delivered
  FilteredOut = "filtered-out",
  // Rate limit enforced by this service
  RateLimited = "rate-limited",
  // Delivery rate limit per medium specified by user
  MediumRateLimitedByUser = "medium-rate-limited-by-user",
}

interface BaseArticleDeliveryState {
  id: string;
  mediumId: string;
  articleIdHash: string;
  article: Article | null;
}

interface ArticleDeliveryPendingDeliveryState extends BaseArticleDeliveryState {
  contentType: ArticleDeliveryContentType;
  status: ArticleDeliveryStatus.PendingDelivery;
  parent?: string;
}

interface ArticleDeliverySentState extends BaseArticleDeliveryState {
  status: ArticleDeliveryStatus.Sent;
  contentType?: ArticleDeliveryContentType;
  parent?: string;
}

interface ArticleDeliveryRateLimitState extends BaseArticleDeliveryState {
  id: string;
  mediumId: string;
  status: ArticleDeliveryStatus.RateLimited;
  parent?: string;
}

interface ArticleDeliveryMediumRateLimitedState
  extends BaseArticleDeliveryState {
  id: string;
  mediumId: string;
  status: ArticleDeliveryStatus.MediumRateLimitedByUser;
  parent?: string;
}

interface ArticleDeliveryRejectedState extends BaseArticleDeliveryState {
  status: ArticleDeliveryStatus.Rejected;
  contentType?: ArticleDeliveryContentType;
  errorCode: ArticleDeliveryErrorCode;
  /**
   * User-facing detail.
   */
  externalDetail: string;
  internalMessage: string;
  parent?: string;
}

interface ArticleDeliveryFailureState extends BaseArticleDeliveryState {
  status: ArticleDeliveryStatus.Failed;
  /**
   * User-facing error code.
   */
  errorCode: ArticleDeliveryErrorCode;
  /**
   * Used for internal troubleshooting.
   */
  internalMessage: string;
  parent?: string;
}

interface ArticleDeliveryFilteredOutState extends BaseArticleDeliveryState {
  status: ArticleDeliveryStatus.FilteredOut;
  externalDetail: string | null;
  parent?: string;
}

export type ArticleDeliveryState =
  | ArticleDeliveryPendingDeliveryState
  | ArticleDeliverySentState
  | ArticleDeliveryFailureState
  | ArticleDeliveryFilteredOutState
  | ArticleDeliveryRejectedState
  | ArticleDeliveryRateLimitState
  | ArticleDeliveryMediumRateLimitedState;
