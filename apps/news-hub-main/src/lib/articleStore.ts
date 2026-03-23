import { type Article } from "@/types";

class ArticleStore {
  private articles: Map<string, Article> = new Map();

  setArticles(articles: Article[]) {
    this.articles.clear();
    articles.forEach(article => {
      this.articles.set(article.id, article);
    });
  }

  getArticle(id: string): Article | undefined {
    return this.articles.get(id);
  }

  addArticle(article: Article) {
    this.articles.set(article.id, article);
  }

  clear() {
    this.articles.clear();
  }
}

export const articleStore = new ArticleStore();
