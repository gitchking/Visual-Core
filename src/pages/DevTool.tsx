import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getDatabase, initDatabase, userService } from '@/lib/database';
import { Database, Users, MessageSquare, Download, Shield, User, UserCheck, Trash2, Plus, Eye, Edit, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import OAuthTest from '@/components/auth/OAuthTest';

const DevTool = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [dbData, setDbData] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [showUsers, setShowUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const { user, profile, signOut } = useAuth();

  const handleLogin = () => {
    if (password === 'Daman@2005') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  const loadDatabaseData = async () => {
    try {
      await initDatabase();
      const db = getDatabase();
      
      const data: any = {};
      
      // Get todos
      const todosStmt = db.prepare('SELECT * FROM todos');
      data.todos = [];
      while (todosStmt.step()) {
        data.todos.push(todosStmt.getAsObject());
      }
      todosStmt.free();

      // Get threads
      const threadsStmt = db.prepare('SELECT * FROM threads');
      data.threads = [];
      while (threadsStmt.step()) {
        data.threads.push(threadsStmt.getAsObject());
      }
      threadsStmt.free();

      // Get flows
      const flowsStmt = db.prepare('SELECT * FROM flows');
      data.flows = [];
      while (flowsStmt.step()) {
        data.flows.push(flowsStmt.getAsObject());
      }
      flowsStmt.free();

      setDbData(data);
    } catch (error) {
      console.error('Failed to load database data:', error);
    }
  };

  const loadAllUsers = async () => {
    try {
      await initDatabase();
      const users = userService.getAllUsers();
      setAllUsers(users);
      setShowUsers(true);
    } catch (error) {
      console.error('Failed to load users:', error);
      alert('Failed to load users from database');
    }
  };

  const deleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await initDatabase();
        const success = userService.deleteUser(userId);
        if (success) {
          loadAllUsers(); // Refresh the list
          alert('User deleted successfully');
        } else {
          alert('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  };

  const viewUserDetails = async (userId: string) => {
    try {
      await initDatabase();
      const { user } = userService.getUserById(userId);
      const { profile } = userService.getUserProfile(userId);
      
      if (user) {
        setSelectedUser({ ...user, profile });
        setShowUserDetails(true);
      }
    } catch (error) {
      console.error('Error loading user details:', error);
      alert('Error loading user details');
    }
  };

  const exportDatabase = () => {
    const db = getDatabase();
    const data = db.export();
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'visualflow-database.db';
    a.click();
  };

  const exportUsers = () => {
    const dataStr = JSON.stringify(allUsers, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users-export.json';
    a.click();
  };

  const filteredUsers = allUsers.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    if (isAuthenticated) {
      loadDatabaseData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">DevTool Access</h1>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <Database className="text-blue-600" />
            DevTool Dashboard
          </h1>
          <div className="flex gap-4 flex-wrap">
            <Button onClick={loadDatabaseData} variant="outline">
              Refresh Data
            </Button>
            <Button onClick={exportDatabase} variant="outline">
              <Download size={16} className="mr-2" />
              Export Database
            </Button>
            <Button onClick={loadAllUsers} variant="outline">
              <Users size={16} className="mr-2" />
              View All Users
            </Button>
            <Button onClick={exportUsers} variant="outline">
              <Download size={16} className="mr-2" />
              Export Users
            </Button>
          </div>
        </div>

        {/* User Management Section */}
        {showUsers && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="text-blue-600" />
              User Management ({filteredUsers.length} users)
            </h2>
            
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search users by email, username, or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Username</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Full Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Created</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-mono text-sm">{user.id}</td>
                      <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                      <td className="border border-gray-300 px-4 py-2">{user.username || 'Not set'}</td>
                      <td className="border border-gray-300 px-4 py-2">{user.full_name || 'Not set'}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => viewUserDetails(user.id)}
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Eye size={14} className="mr-1" />
                            View
                          </Button>
                          <Button
                            onClick={() => deleteUser(user.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Button onClick={() => setShowUsers(false)} variant="outline">
                Hide Users
              </Button>
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {showUserDetails && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="text-blue-600" />
                User Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700">Basic Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">User ID:</span>
                      <span className="text-sm font-mono text-gray-800">{selectedUser.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="text-sm text-gray-800">{selectedUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Created:</span>
                      <span className="text-sm text-gray-800">
                        {new Date(selectedUser.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Updated:</span>
                      <span className="text-sm text-gray-800">
                        {new Date(selectedUser.updated_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700">Profile Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Username:</span>
                      <span className="text-sm font-medium text-gray-800">{selectedUser.username || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Full Name:</span>
                      <span className="text-sm text-gray-800">{selectedUser.full_name || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Gender:</span>
                      <span className="text-sm text-gray-800">{selectedUser.gender || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Bio:</span>
                      <span className="text-sm text-gray-800">{selectedUser.bio || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Website:</span>
                      <span className="text-sm text-gray-800">{selectedUser.website || 'Not set'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex gap-2">
                <Button onClick={() => setShowUserDetails(false)} variant="outline">
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    deleteUser(selectedUser.id);
                    setShowUserDetails(false);
                  }} 
                  variant="outline" 
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={14} className="mr-1" />
                  Delete User
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Current User Information Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <UserCheck className="text-green-600" />
            Current User Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">Authentication Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Logged In:</span>
                  <span className={`text-sm font-medium ${user ? 'text-green-600' : 'text-red-600'}`}>
                    {user ? 'Yes' : 'No'}
                  </span>
                </div>
                {user && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">User ID:</span>
                      <span className="text-sm font-mono text-gray-800">{user.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="text-sm text-gray-800">{user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Created:</span>
                      <span className="text-sm text-gray-800">
                        {new Date(user.created_at).toLocaleString()}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">Profile Information</h3>
              <div className="space-y-2">
                {profile ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Username:</span>
                      <span className="text-sm font-medium text-gray-800">{profile.username || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Full Name:</span>
                      <span className="text-sm text-gray-800">{profile.full_name || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Gender:</span>
                      <span className="text-sm text-gray-800">{profile.gender || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Bio:</span>
                      <span className="text-sm text-gray-800">{profile.bio || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Website:</span>
                      <span className="text-sm text-gray-800">{profile.website || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Profile Updated:</span>
                      <span className="text-sm text-gray-800">
                        {new Date(profile.updated_at).toLocaleString()}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-500">No profile data available</div>
                )}
              </div>
            </div>
          </div>
          
          {user && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button 
                onClick={signOut} 
                variant="outline" 
                className="text-red-600 hover:text-red-700"
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>

        {/* OAuth Test Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="text-purple-600" />
            Authentication Test
          </h2>
          <OAuthTest />
        </div>

        {dbData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Todos */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="text-green-600" />
                Todos ({dbData.todos?.length || 0})
              </h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {dbData.todos?.map((todo: any) => (
                  <div key={todo.id} className="p-2 border rounded">
                    <div className="font-medium">{todo.title}</div>
                    <div className="text-sm text-gray-600">
                      Status: {todo.completed ? 'Completed' : 'Pending'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Threads */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="text-purple-600" />
                Threads ({dbData.threads?.length || 0})
              </h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {dbData.threads?.map((thread: any) => (
                  <div key={thread.id} className="p-2 border rounded">
                    <div className="font-medium">{thread.title}</div>
                    <div className="text-sm text-gray-600">
                      Upvotes: {thread.upvotes}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Flows */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Database className="text-orange-600" />
                Flows ({dbData.flows?.length || 0})
              </h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {dbData.flows?.map((flow: any) => (
                  <div key={flow.id} className="p-2 border rounded">
                    <div className="font-medium">{flow.name}</div>
                    <div className="text-sm text-gray-600">
                      Created: {new Date(flow.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevTool;
