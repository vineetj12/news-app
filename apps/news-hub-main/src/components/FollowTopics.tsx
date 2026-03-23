import { useState } from "react";
import { Heart } from "lucide-react";
import { allTopics, type Topic } from "@/lib/newsData";
import { store } from "@/lib/store";

const FollowTopics = () => {
  const [followed, setFollowed] = useState<Topic[]>(store.getFollowedTopics());

  const toggle = (topic: Topic) => {
    const updated = store.toggleTopic(topic);
    setFollowed([...updated]);
  };

  return (
    <div className="rounded-lg border bg-card p-5 card-shadow">
      <h2 className="mb-3 flex items-center gap-2 font-serif text-lg font-bold text-foreground">
        <Heart className="h-5 w-5 text-primary" /> Follow Topics
      </h2>
      <div className="flex flex-wrap gap-2">
        {allTopics.map((topic) => {
          const isFollowed = followed.includes(topic);
          return (
            <button
              key={topic}
              onClick={() => toggle(topic)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                isFollowed
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {topic}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FollowTopics;
