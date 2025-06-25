from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import SubjectViewSet, TopicViewSet, QuestionViewSet, QuestionBulkUploadView

router = DefaultRouter()
# Register ViewSets with explicit basename parameters
router.register(r"subjects", SubjectViewSet, basename="subject")
router.register(r"topics", TopicViewSet, basename="topic")
router.register(r"questions", QuestionViewSet, basename="question")

urlpatterns = [
    path(
        "questions/bulk-upload/",
        QuestionBulkUploadView.as_view(),
        name="question-bulk-upload",
    ),
    path(
        "subjects/<int:subject_id>/topics/",
        TopicViewSet.as_view({"get": "list_by_subject"}),
        name="subject-topics",
    ),
] + router.urls


# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import SubjectViewSet, TopicViewSet, QuestionViewSet, QuestionBulkUploadView

# router = DefaultRouter()
# router.register(r"subjects", SubjectViewSet)
# router.register(r"topics", TopicViewSet)
# router.register(r"questions", QuestionViewSet)

# urlpatterns = [
#     path(
#         "questions/bulk-upload/",
#         QuestionBulkUploadView.as_view(),
#         name="question-bulk-upload",
#     ),
#     path(
#         "subjects/<int:subject_id>/topics/",
#         TopicViewSet.as_view({"get": "list"}),
#         name="subject-topics",
#     ),
# ] + router.urls
