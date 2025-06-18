"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus, Search, Users } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Employee {
  id: number
  nom: string
  prenom: string
  email: string
  poste: string
  departement: string
  salaire: number
  dateEmbauche: string
}

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      nom: "Dupont",
      prenom: "Jean",
      email: "jean.dupont@entreprise.com",
      poste: "Développeur Frontend",
      departement: "IT",
      salaire: 45000,
      dateEmbauche: "2023-01-15",
    },
    {
      id: 2,
      nom: "Martin",
      prenom: "Marie",
      email: "marie.martin@entreprise.com",
      poste: "Designer UX/UI",
      departement: "Design",
      salaire: 42000,
      dateEmbauche: "2023-03-20",
    },
    {
      id: 3,
      nom: "Bernard",
      prenom: "Pierre",
      email: "pierre.bernard@entreprise.com",
      poste: "Chef de Projet",
      departement: "Management",
      salaire: 55000,
      dateEmbauche: "2022-11-10",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("tous")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    poste: "",
    departement: "",
    salaire: "",
    dateEmbauche: "",
  })

  const departments = ["IT", "Design", "Management", "RH", "Marketing", "Ventes"]

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.poste.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = selectedDepartment === "tous" || employee.departement === selectedDepartment

    return matchesSearch && matchesDepartment
  })

  const resetForm = () => {
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      poste: "",
      departement: "",
      salaire: "",
      dateEmbauche: "",
    })
    setEditingEmployee(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.nom ||
      !formData.prenom ||
      !formData.email ||
      !formData.poste ||
      !formData.departement ||
      !formData.salaire ||
      !formData.dateEmbauche
    ) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      })
      return
    }

    const employeeData = {
      ...formData,
      salaire: Number.parseFloat(formData.salaire),
    }

    if (editingEmployee) {
      // Modifier un employé existant
      setEmployees(
        employees.map((emp) => (emp.id === editingEmployee.id ? { ...employeeData, id: editingEmployee.id } : emp)),
      )
      toast({
        title: "Succès",
        description: "Employé modifié avec succès",
      })
    } else {
      // Ajouter un nouvel employé
      const newEmployee = {
        ...employeeData,
        id: Math.max(...employees.map((e) => e.id), 0) + 1,
      }
      setEmployees([...employees, newEmployee])
      toast({
        title: "Succès",
        description: "Employé ajouté avec succès",
      })
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormData({
      nom: employee.nom,
      prenom: employee.prenom,
      email: employee.email,
      poste: employee.poste,
      departement: employee.departement,
      salaire: employee.salaire.toString(),
      dateEmbauche: employee.dateEmbauche,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setEmployees(employees.filter((emp) => emp.id !== id))
    toast({
      title: "Succès",
      description: "Employé supprimé avec succès",
    })
  }

  const getDepartmentColor = (department: string) => {
    const colors: { [key: string]: string } = {
      IT: "bg-blue-100 text-blue-800",
      Design: "bg-purple-100 text-purple-800",
      Management: "bg-green-100 text-green-800",
      RH: "bg-orange-100 text-orange-800",
      Marketing: "bg-pink-100 text-pink-800",
      Ventes: "bg-yellow-100 text-yellow-800",
    }
    return colors[department] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Gestion des Employés</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Ajouter un employé</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingEmployee ? "Modifier l'employé" : "Ajouter un employé"}</DialogTitle>
              <DialogDescription>
                {editingEmployee
                  ? "Modifiez les informations de l'employé ci-dessous."
                  : "Remplissez les informations du nouvel employé ci-dessous."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    placeholder="Nom de famille"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    placeholder="Prénom"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@entreprise.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="poste">Poste</Label>
                <Input
                  id="poste"
                  value={formData.poste}
                  onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
                  placeholder="Titre du poste"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departement">Département</Label>
                <Select
                  value={formData.departement}
                  onValueChange={(value) => setFormData({ ...formData, departement: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un département" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salaire">Salaire (€)</Label>
                  <Input
                    id="salaire"
                    type="number"
                    value={formData.salaire}
                    onChange={(e) => setFormData({ ...formData, salaire: e.target.value })}
                    placeholder="45000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateEmbauche">Date d'embauche</Label>
                  <Input
                    id="dateEmbauche"
                    type="date"
                    value={formData.dateEmbauche}
                    onChange={(e) => setFormData({ ...formData, dateEmbauche: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">{editingEmployee ? "Modifier" : "Ajouter"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Rechercher et filtrer</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par nom, prénom, email ou poste..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les départements</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des employés */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des employés ({filteredEmployees.length})</CardTitle>
          <CardDescription>Gérez vos employés : modifier ou supprimer leurs informations</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun employé trouvé</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEmployees.map((employee) => (
                <div key={employee.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {employee.prenom} {employee.nom}
                        </h3>
                        <Badge className={getDepartmentColor(employee.departement)}>{employee.departement}</Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <p>
                          <span className="font-medium">Email:</span> {employee.email}
                        </p>
                        <p>
                          <span className="font-medium">Poste:</span> {employee.poste}
                        </p>
                        <p>
                          <span className="font-medium">Salaire:</span> {employee.salaire.toLocaleString()} €
                        </p>
                        <p>
                          <span className="font-medium">Embauché le:</span>{" "}
                          {new Date(employee.dateEmbauche).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(employee)}
                        className="flex items-center space-x-1"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Modifier</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(employee.id)}
                        className="flex items-center space-x-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Supprimer</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
