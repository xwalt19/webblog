"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Edit, Trash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdminPageLogic } from "@/hooks/use-admin-page-logic";

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
}

const ManageUsers: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session } = useSession();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formRole, setFormRole] = useState("");

  const [shouldFetchData, setShouldFetchData] = useState(false);

  const { isLoadingAuth, isAuthenticatedAndAuthorized } = useAdminPageLogic({
    isAdminRequired: true,
    onAuthSuccess: () => setShouldFetchData(true),
  });

  const { data: users, isLoading, isError, error } = useQuery<UserProfile[], Error>({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      if (error) throw error;
      return data || [];
    },
    enabled: shouldFetchData, // Only fetch if authenticated and authorized
    staleTime: 60 * 1000, // Data considered fresh for 1 minute
  });

  const updateUserMutation = useMutation<void, Error, UserProfile>({
    mutationFn: async (userToUpdate) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: userToUpdate.first_name,
          last_name: userToUpdate.last_name,
          role: userToUpdate.role,
        })
        .eq('id', userToUpdate.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success(t("updated successfully"));
      setIsDialogOpen(false);
    },
    onError: (err) => {
      console.error("Error updating user:", err);
      toast.error(t("save failed", { error: err.message }));
    },
  });

  const deleteUserMutation = useMutation<void, Error, string>({
    mutationFn: async (userId) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success(t("deleted successfully"));
    },
    onError: (err) => {
      console.error("Error deleting user:", err);
      toast.error(t("delete error", { error: err.message }));
    },
  });

  useEffect(() => {
    if (!isAuthenticatedAndAuthorized) {
      return;
    }

    const channel = supabase
      .channel('profiles_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticatedAndAuthorized, queryClient]);

  const handleEditUser = () => {
    if (!currentUser) return;

    if (!formFirstName || !formLastName || !formRole) {
      toast.error(t("required fields missing"));
      return;
    }

    updateUserMutation.mutate({
      id: currentUser.id,
      first_name: formFirstName,
      last_name: formLastName,
      role: formRole,
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (!window.confirm(t("confirm delete user"))) {
      return;
    }
    deleteUserMutation.mutate(userId);
  };

  const openDialogForEdit = (user: UserProfile) => {
    setCurrentUser(user);
    setFormFirstName(user.first_name || "");
    setFormLastName(user.last_name || "");
    setFormRole(user.role);
    setIsDialogOpen(true);
  };

  if (isLoadingAuth || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">{t('loading status')}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-destructive">{error?.message}</p>
      </div>
    );
  }

  if (!isAuthenticatedAndAuthorized) {
    return null;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground capitalize">{t('manage users')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('manage users subtitle')}
        </p>
      </section>

      {users && users.length > 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('table name')}</TableHead>
                  <TableHead>{t('table role')}</TableHead>
                  <TableHead className="text-right">{t('table actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.first_name} {user.last_name}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openDialogForEdit(user)} className="mr-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteUser(user.id)} disabled={deleteUserMutation.isPending}>
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

      {(updateUserMutation.isPending || deleteUserMutation.isPending) && (
        <p className="text-center text-muted-foreground mt-4">{t('updating data')}</p>
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={updateUserMutation.isPending}>
              {t('cancel button')}
            </Button>
            <Button onClick={handleEditUser} disabled={updateUserMutation.isPending}>
              {updateUserMutation.isPending ? t('updating status') : t('save changes button')}
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