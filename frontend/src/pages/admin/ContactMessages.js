import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Phone, User, Clock, Trash2 } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('admin_token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API}/admin/contact-messages`, { headers });
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading messages...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Messages ({messages.length})</h2>

      {messages.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No messages yet.</div>
      ) : (
        <div className="grid gap-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <div className="flex flex-wrap gap-4 mb-3">
                <span className="flex items-center gap-2 font-semibold text-gray-800">
                  <User size={16} className="text-pink-500" /> {msg.name}
                </span>
                <a href={`tel:${msg.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-pink-600">
                  <Phone size={16} className="text-pink-500" /> {msg.phone}
                </a>
                {msg.email && (
                  <a href={`mailto:${msg.email}`} className="flex items-center gap-2 text-gray-600 hover:text-pink-600">
                    <Mail size={16} className="text-pink-500" /> {msg.email}
                  </a>
                )}
                <span className="flex items-center gap-2 text-gray-400 text-sm ml-auto">
                  <Clock size={14} />
                  {new Date(msg.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
              <p className="text-gray-700 bg-gray-50 rounded-lg px-4 py-3 mt-2">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactMessages;