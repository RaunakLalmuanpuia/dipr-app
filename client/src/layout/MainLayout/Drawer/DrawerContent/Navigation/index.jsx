// material-ui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import menuItems from '../../../../../menu-items';
import NavGroup from './NavGroup';
import useAuth from "../../../../../hooks/useAuth";
// ==============================|| DRAWER CONTENT - RESPONSIVE DRAWER ||============================== //

export default function NavigationDrawer() {

    const { auth } = useAuth();

    const filterByRole = (menuList) => {
        return menuList
            .filter(item => {
                if (!item.allowedRoles) return true; // no restriction
                return auth?.roles?.some(role => item.allowedRoles.includes(role));
            })
            .map(item => ({
                ...item,
                children: item.children ? filterByRole(item.children) : undefined
            }))
            .filter(item => !(item.children && item.children.length === 0));
    };

    const filteredMenu = filterByRole(menuItems.items);


    const navGroups = filteredMenu.map((item, index) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={index} item={item} />;
            default:
                return (
                    <Typography key={index} variant="h6" color="error" align="center">
                        Fix - Navigation Group
                    </Typography>
                );
        }
    });


    return <Box sx={{ transition: 'all 0.3s ease-in-out' }}>{navGroups}</Box>;
}
