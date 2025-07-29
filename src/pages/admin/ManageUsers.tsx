"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Edit, Trash, User as UserIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  // created_at: string; // Removed as it does not exist in the database schema
}

const ManageUsers: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, loading: sessionLoading } = useSession();
  const isAdmin = profile?.role === 'admin';

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formRole, setFormRole] = useState("");

  useEffect(() => {
    if (!sessionLoading) {
      if (!session) {
        toast.error(t('login required'));
        navigate('/login');
      } else if (!isAdmin) {
        toast.error(t('admin required'));
        navigate('/');
      } else {
        fetchUsers();

        const channel = supabase
          .channel('profiles_changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'profiles' },
            (payload) => {
              if (payload.eventType === 'INSERT') {
                setUsers((prev) => [payload.new as UserProfile, ...prev]);
              } else if (payload.eventType === 'UPDATE') {
                setUsers((prev) =>
                  prev.map((user) =>
                    user.id === payload.new.id ? (payload.new as UserProfile) : user
                  )
                );
              } else if (payload.eventType === 'DELETE') {
                setUsers((prev) =>
                  prev.filter((user) => user.id !== payload.old.id)
                );
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    }
  }, [session, isAdmin, sessionLoading, navigate, t]);

  const fetchUsers = async () => {
    setDataLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        // .order('created_at', { ascending: false }); // Removed as 'created_at' column does not exist

      if (error) {
        throw error;
      }
      setUsers(data || []);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(t("fetch data error", { error: err.message }));
    } finally {
      setDataLoading(false);
    }
  };

  const handleEditUser = async () => {
    if (!currentUser) return;

    if (!formFirstName || !formLastName || !formRole) {
      toast.error(t("required fields missing"));
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formFirstName,
          last_name: formLastName,
          role: formRole,
        })
        .eq('id', currentUser.id);

      if (error) {
        throw error;
      }
      toast.success(t("updated successfully"));
      setIsDialogOpen(false);
      // No need to call fetchUsers() here, Realtime will handle the update
    } catch (err: any) {
      console.error("Error updating user:", err);
      toast.error(t("save failed", { error: err.message }));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm(t("confirm delete user"))) {
      return;
    }
    try {
      // Deleting from 'profiles' table will cascade delete from 'auth.users'
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        throw error;
      }
      toast.success(t("deleted successfully"));
      // No need to call fetchUsers() here, Realtime will handle the update
    } catch (err: any) {
      console.error("Error deleting user:", err);
      toast.error(t("delete error", { error: err.message }));
    }
  };

  const openDialogForEdit = (user: UserProfile) => {
    setCurrentUser(user);
    setFormFirstName(user.first_name || "");
    setFormLastName(user.last_name || "");
    setFormRole(user.role);
    setIsDialogOpen(true);
  };

  // Removed formatDisplayDate as created_at is no longer used for display
  // const formatDisplayDate = (isoString: string) => {
  //   const dateObj = new Date(isoString);
  //   return dateObj.toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric',
  //   });
  // };

  if (sessionLoading || (!session && !sessionLoading) || (session && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('manage users')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('manage users subtitle')}
        </p>
      </section>

      {dataLoading ? (
        <p className="text-center text-muted-foreground">{t('loading status')}</p>
      ) : error ? (
        <p className="text-center text-destructive">{error}</p>
      ) : users.length > 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('table name')}</TableHead>
                  <TableHead>{t('table role')}</TableHead>
                  {/* <TableHead>{t('table created at')}</TableHead> */} {/* Removed from display */}
                  <TableHead className="text-right">{t('table actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.first_name} {user.last_name}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    {/* <TableCell>{formatDisplayDate(user.created_at)}</TableCell> */} {/* Removed from display */}
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openDialogForEdit(user)} className="mr-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteUser(user.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <p className="text-center text-muted-foreground mt-8 text-lg">{t('no users found')}</p>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('edit user profile')}</DialogTitle>
            <DialogDescription>
              {t('edit user profile description')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                {t('first name label')}
              </Label>
              <Input
                id="firstName"
                value={formFirstName}
                onChange={(e) => setFormFirstName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                {t('last name label')}
              </Label>
              <Input
                id="lastName"
                value={formLastName}
                onChange={(e) => setFormLastName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                {t('role label')}
              </Label>
              <Select value={formRole} onValueChange={setFormRole}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t('select role placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">{t('admin role')}</SelectItem>
                  <SelectItem value="member">{t('member role')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('cancel button')}
            </Button>
            <Button onClick={handleEditUser}>
              {t('save changes button')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="text-center mt-12">
        <Link to="/admin">
          <Button>{t('back to dashboard')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default ManageUsers;