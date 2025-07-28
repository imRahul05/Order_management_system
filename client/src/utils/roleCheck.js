export const hasRole = (user, allowedRoles) => {
  if (!user || !user.role) return false;
  return allowedRoles.includes(user.role);
};

export const isCustomer = (user) => {
  return user?.role === 'customer';
};

export const isStaff = (user) => {
  return user?.role === 'staff';
};

export const redirectByRole = (user) => {
  if (!user) return '/login';
  
  switch (user.role) {
    case 'customer':
      return '/customer/products';
    case 'staff':
      return '/staff/dashboard';
    default:
      return '/login';
  }
};
