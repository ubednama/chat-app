import { useEffect, useMemo, useState } from 'react'
import {IoSearchSharp} from "react-icons/io5"
import toast from 'react-hot-toast';
import useGetAllUsers from '../../hooks/useGetAllUsers';
import useGetConversations from '../../hooks/useGetConversations';

const SearchInput = ({ onSearch }) => {
  const [search, setSearch] = useState("");
  const { users } = useGetAllUsers();
  const { conversations } = useGetConversations();

  const chatIds = useMemo(
    ()=> new Set(conversations.map((user) => user._id)), [conversations]
  )

  useEffect(() => {
    if (search.trim() === "") {
      onSearch("", [], conversations);
    } else {
      const globalSearch = users.filter(
        (user) =>
          !chatIds.has(user._id) &&
          (user.fullName.toLowerCase().includes(search.toLowerCase()) ||
            user.username.toLowerCase().includes(search.toLowerCase()))
      );
      const chats = conversations.filter(
        (user) =>
          user.fullName.toLowerCase().includes(search.toLowerCase()) ||
          user.username.toLowerCase().includes(search.toLowerCase())
      );
      onSearch(search, globalSearch, chats);
    }
  }, [search, users, onSearch, conversations, chatIds]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;
    toast.error("No results found");
  };

  return (
    <div className="search-input-container w-full relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search.."
          className="flex w-3/4 input input-bordered rounded-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-circle bg-sky-500 text-white">
          <IoSearchSharp className="size-6 outline-none" />
        </button>
      </form>
    </div>
  );
};

export default SearchInput