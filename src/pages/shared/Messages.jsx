
import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Get the logged-in user's ID from the stored user object.
  const getCurrentUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return String(user._id || user.id || user.userId || "");
    } catch {
      return "";
    }
  };

  const currentUserId = getCurrentUserId();

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return conversations.filter((conversation) =>
      conversation.name.toLowerCase().includes(query) ||
      conversation.taskTitle.toLowerCase().includes(query)
    );
  }, [conversations, search]);

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedId
  );

  // Fetch active conversations.
  // Fetch active conversations.
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api.get("/messages");

        console.log("MESSAGES API RESPONSE:", response.data);

        const formattedConversations = (
          response.data.conversations || []
        ).map((conversation) => ({
          id: String(conversation.applicationId),
          name: conversation.user?.name || "User",
          taskTitle: conversation.taskTitle || "Project",
        }));

        setConversations(formattedConversations);

        // Automatically select the conversation from notification URL.
        const params = new URLSearchParams(window.location.search);
        const conversationId = params.get("conversationId");

        if (conversationId) {
          const matchingConversation = formattedConversations.find(
            (conversation) => conversation.id === conversationId
          );

          if (matchingConversation) {
            setSelectedId(conversationId);
          }
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);

        setError(
          error.response?.data?.message ||
          "Failed to load conversations."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Fetch saved messages whenever a conversation is selected.
  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }

    let isMounted = true;

    const fetchMessages = async () => {
      setMessagesLoading(true);
      setError("");
      setMessages([]);

      try {
        const response = await api.get(`/messages/${selectedId}`);

        if (isMounted) {
          setMessages(response.data.messages || []);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);

        if (isMounted) {
          setError(
            error.response?.data?.message ||
            "Failed to load messages."
          );
        }
      } finally {
        if (isMounted) {
          setMessagesLoading(false);
        }
      }
    };

    fetchMessages();

    return () => {
      isMounted = false;
    };
  }, [selectedId]);

  // Send and save a message through the backend.
  const sendMessage = async (event) => {
    event.preventDefault();

    const text = draft.trim();

    if (!text || !selectedId || sending) return;

    setSending(true);
    setError("");

    try {
      const response = await api.post(`/messages/${selectedId}`, {
        text,
      });

      const savedMessage = response.data.data;

      if (savedMessage) {
        setMessages((current) => [...current, savedMessage]);
      }

      setDraft("");
    } catch (error) {
      console.error("Failed to send message:", error);

      setError(
        error.response?.data?.message ||
        "Failed to send message. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
          Messages
        </h1>
        <p className="mt-1 text-base leading-6 text-gray-700">
          Keep project conversations and updates in one place.
        </p>
      </header>

      <div className="grid min-h-[560px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:h-[70vh] md:min-h-[560px] md:max-h-[760px] md:grid-cols-[320px_minmax(0,1fr)]">
        <aside
          className={`${selectedConversation ? "hidden md:flex" : "flex"} min-h-0 flex-col border-b border-gray-200 md:border-b-0 md:border-r`}
        >
          <div className="shrink-0 border-b border-gray-200 p-4 sm:p-5">
            <h2 className="text-lg font-semibold text-gray-950">
              Conversations
            </h2>

            <label htmlFor="conversation-search" className="sr-only">
              Search conversations
            </label>
            <input
              id="conversation-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or project"
              className="mt-3 min-h-11 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base text-gray-950 outline-none placeholder:text-gray-500 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {error && !selectedConversation && !loading && (
            <p
              role="alert"
              className="m-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900"
            >
              {error}
            </p>
          )}

          {loading ? (
            <p
              role="status"
              className="m-auto p-6 text-center text-sm text-gray-700"
            >
              Loading conversations...
            </p>
          ) : filteredConversations.length === 0 ? (
            <div role="status" className="m-auto p-6 text-center">
              <p className="text-sm font-semibold text-gray-900">
                {search.trim()
                  ? "No matching conversations"
                  : "No conversations yet"}
              </p>
              <p className="mt-2 text-sm leading-5 text-gray-700">
                {search.trim()
                  ? "Try another name or project title."
                  : "Project conversations will appear here when available."}
              </p>
            </div>
          ) : (
            <ul
              aria-label="Conversation list"
              className="min-h-0 flex-1 divide-y divide-gray-200 overflow-y-auto"
            >
              {filteredConversations.map((conversation) => (
                <li key={conversation.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(conversation.id)}
                    aria-pressed={selectedId === conversation.id}
                    className={`w-full border-l-2 p-4 text-left transition-colors hover:bg-gray-50 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-700 ${
                      selectedId === conversation.id
                        ? "border-l-blue-700 bg-blue-50"
                        : "border-l-transparent"
                    }`}
                  >
                    <span className="block truncate text-base font-semibold text-gray-950">
                      {conversation.name}
                    </span>
                    <span className="mt-1 block truncate text-sm text-gray-700">
                      {conversation.taskTitle}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <section className="flex min-h-0 min-w-0 flex-col">
          {!selectedConversation ? (
            <div className="hidden flex-1 flex-col items-center justify-center px-6 py-16 text-center md:flex">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-6 w-6 text-blue-800"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"
                  />
                </svg>
              </div>

              <h2 className="mt-4 text-base font-semibold text-gray-950">
                Select a conversation
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-gray-700">
                Choose a project from the list to read and send messages.
              </p>
            </div>
          ) : (
            <>
              <header className="shrink-0 border-b border-gray-200 px-4 py-3 sm:px-5">
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setSelectedId(null);
                  }}
                  className="mb-2 inline-flex min-h-11 items-center text-sm font-semibold text-blue-800 hover:text-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 md:hidden"
                >
                  ← All conversations
                </button>
                <h2 className="truncate text-base font-semibold text-gray-950 sm:text-lg">
                  {selectedConversation.name}
                </h2>
                <p className="mt-1 truncate text-sm text-gray-700">
                  {selectedConversation.taskTitle}
                </p>
              </header>

              <div
                role="log"
                aria-label={`Messages with ${selectedConversation.name}`}
                aria-live="polite"
                aria-relevant="additions text"
                className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 sm:p-5"
              >
                {messagesLoading ? (
                  <p
                    role="status"
                    className="m-auto text-sm text-gray-700"
                  >
                    Loading messages...
                  </p>
                ) : messages.length === 0 ? (
                  <p
                    role="status"
                    className="m-auto text-center text-sm leading-6 text-gray-700"
                  >
                    No messages in this conversation yet. Send a message to
                    start the discussion.
                  </p>
                ) : (
                  messages.map((message) => {
                    const senderId =
                      typeof message.sender === "object"
                        ? message.sender?._id
                        : message.sender;

                    const isMine =
                      currentUserId &&
                      String(senderId) === currentUserId;
                    const messageTime = formatTime(message.createdAt);

                    return (
                      <article
                        key={message._id}
                        className={`max-w-[88%] rounded-xl px-4 py-3 text-sm leading-5 sm:max-w-[80%] ${
                          isMine
                            ? "self-end rounded-br-sm bg-blue-700 text-white"
                            : "self-start rounded-bl-sm bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {message.text}
                        </p>

                        {messageTime && (
                          <time
                            dateTime={message.createdAt}
                            className={`mt-2 block text-right text-xs ${
                              isMine ? "text-blue-100" : "text-gray-600"
                            }`}
                          >
                            {isMine ? "You" : selectedConversation.name}
                            {" · "}
                            {messageTime}
                          </time>
                        )}
                      </article>
                    );
                  })
                )}
              </div>

              {error && (
                <p
                  role="alert"
                  className="mx-4 mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900 sm:mx-5"
                >
                  {error}
                </p>
              )}

              <form
                onSubmit={sendMessage}
                className="flex shrink-0 gap-2 border-t border-gray-200 p-3 sm:p-4"
              >
                <label htmlFor="message-draft" className="sr-only">
                  Write a message
                </label>
                <input
                  id="message-draft"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Write a message..."
                  className="min-h-11 min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-base text-gray-950 outline-none placeholder:text-gray-500 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="submit"
                  disabled={!draft.trim() || sending || messagesLoading}
                  aria-busy={sending}
                  className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
