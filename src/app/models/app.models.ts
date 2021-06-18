export interface User {
  id?:               number;
  name:             string;
  email:            string;
  phone:            string;
  status?:           string;
  profile_id:       number;
  created_at?:       Date;
  updated_at?:       Date;
  profile:          Profile;
}

export interface Profile {
  id?:          number;
  name:        string;
  description: string;
  status?:      string;
}
