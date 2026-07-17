/**
 * Script de seed pour créer l'utilisateur admin initial.
 * 
 * Puisque POST /auth/register est réservé à admin,
 * ce script crée le premier admin directement en base.
 * 
 * Usage : node seeds/admin-seed.js
 */
require('dotenv').config();
const { sequelize, User } = require('../models/index');

const seedAdmin = async () => {
  try {
    await sequelize.sync({ alter: true });

    // Vérifier si un admin existe déjà
    const existingAdmin = await User.findOne({ where: { role: 'admin' } });
    if (existingAdmin) {
      console.log('Un utilisateur admin existe déjà :', existingAdmin.email);
      process.exit(0);
    }

    // Créer l'admin initial
    const admin = await User.create({
      nom: 'Admin RefTech',
      email: 'admin@reftech.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('Utilisateur admin créé avec succès :');
    console.log(`  Email : ${admin.email}`);
    console.log(`  Mot de passe : admin123`);
    console.log(`  Rôle : ${admin.role}`);
    console.log('\n⚠️  Changez le mot de passe en production !');

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seed :', error);
    process.exit(1);
  }
};

seedAdmin();
