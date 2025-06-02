const { Sequelize } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user.model");
const UserDevice = require("./userDevice.model");
const Report = require("././report/report.model");
const ReportImage = require("././report/reportImage.model");
const ReportComment = require("././report/ReportComment.model");
const ReportStatusHistory = require("././report/reportStatusHistory.model");
const Alert = require("././Alert/alert.model");
const AlertRead = require("././Alert/alertRead.model");
const Service = require("././Service/service.model");
const ServiceSchedule = require("././Service/serviceSchedule.model");
const ServiceRequest = require("././Service/serviceRequest.model");
const Document = require("././document/document.model");
const RequestDocument = require("././document/requestDocument.model");

// Define Sequelize operator aliases
const Op = Sequelize.Op;

//User associations
User.hasMany(UserDevice, { foreignKey: "user_id", as: "devices" });
User.hasMany(Report, { foreignKey: "user_id", as: "reports" });
User.hasMany(Report, { foreignKey: "assigned_to", as: "assignedReports" });
User.hasMany(ReportComment, { foreignKey: "user_id", as: "reportComments" });
User.hasMany(ReportStatusHistory, {
  foreignKey: "user_id",
  as: "statusUpdates",
});
User.hasMany(Alert, { foreignKey: "created_by", as: "createdAlerts" });
User.hasMany(AlertRead, { foreignKey: "user_id", as: "readAlerts" });
User.hasMany(ServiceRequest, { foreignKey: "user_id", as: "serviceRequests" });
User.hasMany(ServiceRequest, {
  foreignKey: "assigned_to",
  as: "assignedRequests",
});

// Report associations
Report.belongsTo(User, { foreignKey: "user_id", as: "reporter" });
Report.belongsTo(User, { foreignKey: "assigned_to", as: "assignedTo" });
Report.hasMany(ReportImage, { foreignKey: "report_id", as: "images" });
Report.hasMany(ReportComment, { foreignKey: "report_id", as: "comments" });
Report.hasMany(ReportStatusHistory, {
  foreignKey: "report_id",
  as: "statusHistory",
});

// ReportImage associations
ReportImage.belongsTo(Report, { foreignKey: "report_id", as: "report" });

// ReportComment associations
ReportComment.belongsTo(Report, { foreignKey: "report_id", as: "report" });
ReportComment.belongsTo(User, { foreignKey: "user_id", as: "user" });

// ReportStatusHistory associations
ReportStatusHistory.belongsTo(Report, {
  foreignKey: "report_id",
  as: "report",
});
ReportStatusHistory.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Alert associations
Alert.belongsTo(User, { foreignKey: "created_by", as: "creator" });
Alert.hasMany(AlertRead, { foreignKey: "alert_id", as: "reads" });

// AlertRead associations
AlertRead.belongsTo(Alert, { foreignKey: "alert_id", as: "alert" });
AlertRead.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Service associations
Service.hasMany(ServiceSchedule, { foreignKey: "service_id", as: "schedules" });
Service.hasMany(ServiceRequest, { foreignKey: "service_id", as: "requests" });
Service.hasMany(Document, { foreignKey: "service_id", as: "documents" });

// ServiceSchedule associations
ServiceSchedule.belongsTo(Service, { foreignKey: "service_id", as: "service" });

// ServiceRequest associations
ServiceRequest.belongsTo(Service, { foreignKey: "service_id", as: "service" });
ServiceRequest.belongsTo(User, { foreignKey: "user_id", as: "user" });
ServiceRequest.belongsTo(User, {
  foreignKey: "assigned_to",
  as: "assignedStaff",
});
ServiceRequest.hasMany(RequestDocument, {
  foreignKey: "service_request_id",
  as: "documents",
});

// Document associations
Document.belongsTo(Service, { foreignKey: "service_id", as: "service" });

// RequestDocument associations
RequestDocument.belongsTo(ServiceRequest, {
  foreignKey: "service_request_id",
  as: "request",
});

// UserDevice associations
UserDevice.belongsTo(User, { foreignKey: "user_id", as: "user" });

module.exports = {
  sequelize,
  Op,
  User,
  UserDevice,
  Report,
  ReportImage,
  ReportComment,
  ReportStatusHistory,
  Alert,
  AlertRead,
  Service,
  ServiceSchedule,
  ServiceRequest,
  Document,
  RequestDocument,
};
