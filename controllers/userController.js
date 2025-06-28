import {findUserById} from '../models/authModel.js';
import { getDashboardDataForUser } from '../models/userController.js';

export async function getUser(req, res) {
  const { id } = req.params;
  const { data, error } = await findUserById(id);
  if (error || !data) return res.status(404).json({ error: 'User not found' });

  res.status(200).json({ user: data });
}

export const getUserDashboard = async (req, res) => {
  const { user_id } = req.params;

  try {
    const dashboard = await getDashboardDataForUser(parseInt(user_id));

    return res.status(200).json({
      success: true,
      dashboard
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

