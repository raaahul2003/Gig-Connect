
import { useMemo, useState } from "react";

export default function Messages() {
  const [conversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [localMessages, setLocalMessages] = useState({});

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return conversations.filter((conversation) =>
      conversation.name.toLowerCase().includes(query)
    );
  }, [conversations, search]);

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedId
  );

  const messages = selectedId
    ? localMessages[selectedId] ?? selectedConversation?.messages ?? []
    : [];

  function sendMessage(event) {
    event.preventDefault();

    const text = draft.trim();

    if (!text || !selectedConversation) return;

    setLocalMessages((current) => ({
      ...current,
      [selectedId]: [
        ...(current[selectedId] ?? selectedConversation.messages ?? []),
        {
          id: `${Date.now()}`,
          text,
          sender: "me",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
    }));

    setDraft("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
        <p className="mt-1 text-sm text-gray-500">
          Communicate with clients and freelancers about your tasks.
        </p>
      </div>

      <div className="grid min-h-[560px] overflow-hidden rounded-xl border border-gray-200 bg-white md:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="border-b border-gray-200 md:border-b-0 md:border-r">
          <div className="border-b border-gray-100 p-4">
            <h2 className="font-semibold text-gray-900">Conversations</h2>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search conversations..."
              aria-label="Search conversations"
              className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm font-medium text-gray-800">
                No conversations found
              </p>
              <p className="mt-2 text-xs leading-5 text-gray-500">
                Conversations will appear here when you connect with someone
                about a task.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => setSelectedId(conversation.id)}
                  className={`w-full p-4 text-left transition hover:bg-gray-50 ${
                    selectedId === conversation.id ? "bg-blue-50" : ""
                  }`}
                >
                  <p className="truncate text-sm font-medium text-gray-900">
                    {conversation.name}
                  </p>
                  <p className="mt-1 truncate text-xs text-gray-500">
                    {conversation.lastMessage || "Start a conversation"}
                  </p>
                </button>
              ))}
            </div>
          )}
        </aside>

        <section className="flex min-w-0 flex-col">
          {!selectedConversation ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-7 w-7 text-blue-600"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"
                  />
                </svg>
              </div>
              <h2 className="mt-4 font-semibold text-gray-900">
                Your messages will appear here
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                Select a conversation to read and send messages, or return
                when you have connected with a client or freelancer.
              </p>
            </div>
          ) : (
            <>
              <div className="border-b border-gray-200 p-4">
                <h2 className="font-semibold text-gray-900">
                  {selectedConversation.name}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  {selectedConversation.taskTitle || "GigConnect conversation"}
                </p>
              </div>

              <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
                {messages.length === 0 ? (
                  <p className="m-auto text-sm text-gray-500">
                    No messages in this conversation yet.
                  </p>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${
                        message.sender === "me"
                          ? "self-end bg-blue-600 text-white"
                          : "self-start bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {message.text}
                      </p>
                      <p className="mt-1 text-right text-xs opacity-70">
                        {message.time}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <form
                onSubmit={sendMessage}
                className="flex gap-2 border-t border-gray-200 p-3"
              >
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Write a message..."
                  aria-label="Write a message"
                  className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Send
                </button>
              </form>
              <p className="px-4 pb-3 text-xs text-gray-400">
                Messages are currently stored only in this page's local state.
              </p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
