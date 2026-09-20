import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  useAssignUserRoleMutation,
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useGetCurrentUserQuery,
  useGetPermissionsQuery,
  useGetRolesQuery,
  useGetUsersQuery,
} from '../../store/api/apiSlice';

export default function AdminPage(): JSX.Element {
  const user = useGetCurrentUserQuery(undefined);
  const isAdmin = user.data?.role === 'admin';
  const canManageRoles = isAdmin || Boolean(user.data?.permissions.includes('roles.manage'));
  const canManageUsers = isAdmin || Boolean(user.data?.permissions.includes('users.manage'));
  const canAccessSiteAdmin = isAdmin || Boolean(user.data?.permissions.some((permission) => [
    'site.admin.access',
    'roles.manage',
    'users.manage',
    'community.media.manage',
  ].includes(permission)));
  const roles = useGetRolesQuery(undefined, { skip: !canManageRoles && !canManageUsers });
  const users = useGetUsersQuery(undefined, { skip: !canManageUsers });
  const permissions = useGetPermissionsQuery(undefined, { skip: !canManageRoles });
  const [createRole] = useCreateRoleMutation();
  const [assignUserRole] = useAssignUserRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [permissionKeys, setPermissionKeys] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  if (user.isLoading) {
    return <Typography>Loading account...</Typography>;
  }
  if (!canAccessSiteAdmin) {
    return <Alert severity="error">Administrator access required.</Alert>;
  }

  const handleCreateRole = async () => {
    setMessage(null);
    try {
      await createRole({
        name,
        description,
        permissionKeys,
      }).unwrap();
      setName('');
      setDescription('');
      setPermissionKeys([]);
      setMessage('Role created.');
    } catch {
      setMessage('Role could not be created.');
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!window.confirm('Delete this role? Assigned users must be moved first.')) return;
    try {
      await deleteRole(roleId).unwrap();
      setMessage('Role deleted.');
    } catch {
      setMessage('Role could not be deleted. Remove assigned users first.');
    }
  };

  const handleAssignRole = async (userId: string, roleId: string) => {
    try {
      await assignUserRole({ userId, roleId: roleId || null }).unwrap();
      setMessage('User role updated.');
    } catch {
      setMessage('User role could not be updated.');
    }
  };

  return (
    <Stack spacing={4} sx={{ maxWidth: 720, mx: 'auto', py: { xs: 4, md: 8 }, px: 2 }}>
      <Box>
        <Typography variant="h3">Site Admin</Typography>
        <Typography color="text.secondary">Manage Discord accounts, roles, and permissions.</Typography>
      </Box>
      {message ? <Alert severity="info">{message}</Alert> : null}
      {canManageRoles ? <Stack spacing={2}>
        <Typography variant="h5">Create role</Typography>
        <TextField label="Name" value={name} onChange={(event) => setName(event.target.value)} />
        <TextField label="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
        <Typography variant="subtitle1">Permissions</Typography>
        <FormGroup>
          {permissions.data?.map((permission) => (
            <FormControlLabel
              key={permission.key}
              control={
                <Checkbox
                  checked={permissionKeys.includes(permission.key)}
                  onChange={(event) =>
                    setPermissionKeys((current) =>
                      event.target.checked
                        ? [...current, permission.key]
                        : current.filter((key) => key !== permission.key),
                    )
                  }
                />
              }
              label={`${permission.label} — ${permission.description}`}
            />
          ))}
        </FormGroup>
        <Button variant="contained" onClick={() => void handleCreateRole()} disabled={!name.trim()}>Create role</Button>
      </Stack> : null}
      <Divider />
      {canManageRoles ? <Stack spacing={2}>
        <Typography variant="h5">Roles and permissions</Typography>
        <Table size="small">
          <TableHead><TableRow><TableCell>Role</TableCell><TableCell>Description</TableCell><TableCell>Permissions</TableCell><TableCell>Users</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
          <TableBody>
            {roles.data?.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.description ?? '—'}</TableCell>
                <TableCell>{role.permissions.length ? role.permissions.map(({ permission }) => permission.key).join(', ') : 'No permissions assigned'}</TableCell>
                <TableCell>{role._count?.users ?? 0}</TableCell>
                <TableCell>
                  <Button
                    color="error"
                    size="small"
                    disabled={role.name === 'admin' || (role._count?.users ?? 0) > 0}
                    onClick={() => void handleDeleteRole(role.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack> : null}
      <Divider />
      {canManageUsers ? <Stack spacing={2}>
        <Typography variant="h5">Discord users</Typography>
        <Table size="small">
          <TableHead><TableRow><TableCell>Discord user</TableCell><TableCell>Discord ID</TableCell><TableCell>Status</TableCell><TableCell>Assigned role</TableCell></TableRow></TableHead>
          <TableBody>
            {users.data?.map((siteUser) => (
              <TableRow key={siteUser.id}>
                <TableCell>{siteUser.username ?? 'Unnamed Discord user'}</TableCell>
                <TableCell>{siteUser.discordId ?? '—'}</TableCell>
                <TableCell>{siteUser.status}</TableCell>
                <TableCell>
                  <Select size="small" value={siteUser.role?.id ?? ''} displayEmpty onChange={(event) => void handleAssignRole(siteUser.id, event.target.value)}>
                    <MenuItem value="">Pending / no access</MenuItem>
                    {roles.data?.map((role) => <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>)}
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack> : null}
    </Stack>
  );
}
