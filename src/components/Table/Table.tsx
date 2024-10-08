import {useEffect, useState} from "react";
import {
    Button,
    MenuItem,
    Select,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import {getUsers, updateUser} from "../../helpers/instance.service.ts";

export type User = {
    id: string;
    createdAt: string;
    name: string;
    login: string;
    group: string;
    active: boolean;
}


export const UserTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [users, setUsers] = useState<User[]>([]);


    const getData = async () => {
        const data = await getUsers();
        if (data) {
            setUsers(data.data)
        }
    }

    useEffect(() => {
        getData();
    }, []);


    const handleToggleActive = async (userId: string, active: boolean) => {
        const res = await updateUser(userId, {active});
        if (res) {
            setUsers(users.map(user =>
                user.id === userId ? { ...res.data } : user
            ));
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleGroupChange = (event: SelectChangeEvent<unknown>) => {
        setSelectedGroup(event.target.value as string);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.login.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGroup = selectedGroup ? user.group === selectedGroup : true;
        return matchesSearch && matchesGroup;
    });

    const uniqueGroups = Array.from(new Set(users.map(user => user.group)));

    return (
        <div style={{ padding: '16px' }}>
            <TextField
                label="Поиск"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ marginBottom: '16px' }}
            />
            <Select
                value={selectedGroup}
                onChange={handleGroupChange}
                displayEmpty
                style={{ marginBottom: '16px', marginLeft: '16px', minWidth: '120px' }}
            >
                <MenuItem value="">
                    <em>Все группы</em>
                </MenuItem>
                {uniqueGroups.map(group => (
                    <MenuItem key={group} value={group}>{group}</MenuItem>
                ))}
            </Select>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Login</TableCell>
                            <TableCell>Group</TableCell>
                            <TableCell>Active</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.login}</TableCell>
                                <TableCell>{user.group}</TableCell>
                                <TableCell>{user.active ? 'Yes' : 'No'}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color={user.active ? 'error' : 'success' as 'success' | 'error'}
                                        onClick={() => handleToggleActive(user.id, !user.active)}
                                    >
                                        {user.active ? 'Выключить' : 'Включить'}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};
