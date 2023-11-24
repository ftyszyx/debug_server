export const getTokenRedisKey = (user_id: number) => {
  return `token_${user_id}`;
};

export function getRoleRedisKey(roleid: number) {
  return `role_${roleid}`;
}

export function getPowerRedisKey(powerid: number) {
  return `power_${powerid}`;
}
